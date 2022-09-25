import { useEffect, useState, useRef } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Conversation, Stream, Message } from '@xmtp/xmtp-js';
import { useXmptContext } from 'context/XmtpContext';

import { XMTPChatLog } from 'components/XMTPChatLog';
import { useWalletContext } from 'context/WalltetContext';
import { ControlPanel } from 'components/ControlPanel';
import arbiterContract from 'contracts/Arbiter.json';
import rulesContract from 'contracts/TicTacToeRules.json';

import styles from 'pages/games/gameType.module.scss';
import { ETTicTacToe } from '../../components/Games/ET-Tic-Tac-Toe';
import {
  decodeEncodedBoardState,
  TicTacToeState,
  TTTMove,
} from '../../components/Games/ET-Tic-Tac-Toe/types';
import { IChatLog } from '../../types';
import {
  _isValidSignedMove,
  checkIsValidMove,
  getArbiter,
  getSigner,
  getRulesContract,
  disputeMove,
  initTimeout,
  resolveTimeout,
  finalizeTimeout,
  finishGame,
} from '../../gameApi';
// import { ISignedGameMove } from '../../types/arbiter';
import { PlayerI } from 'types';
import { GameField, JoinGame, LeftPanel, SelectGame, SelectPrize } from 'components';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import gameApi from 'gameApi';
import { ISignedGameMove, SignedGameMove } from '../../types/arbiter';
import { signMove, signMoveWithAddress } from 'helpers/session_signatures';

interface IGamePageProps {
  gameType?: string;
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}
const PROPOSER_INGAME_ID = 0;
const ACCEPTER_INGAME_ID = 1;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const FETCH_RIVAL_ADDRESS_TIMEOUT = 2500;

const arbiterContractData = {
  abi: arbiterContract.abi,
  address: arbiterContract.address,
};

const gameRulesContractData = {
  abi: rulesContract.abi,
  address: rulesContract.address,
};

//mb this better https://pgarciacamou.medium.com/react-simple-polling-custom-hook-usepollingeffect-1e9b6b8c9c71
export function useInterval(callback: () => any, delay: number | undefined) {
  const savedCallback = useRef<() => any>(() => {});
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Game: NextPage<IGamePageProps> = ({ gameType }) => {
  const [log, setLog] = useState<IChatLog[]>([]);
  const [isLogLoading, setIsLogLoading] = useState<boolean>(true);

  const initialState = new TicTacToeState(1, 'X')
    .makeMove(TTTMove.fromMove(0, 'X'))
    .makeMove(TTTMove.fromMove(1, 'X'))
    .makeMove(TTTMove.fromMove(2, 'X'))
    .makeMove(TTTMove.fromMove(3, 'X'))
    .makeMove(TTTMove.fromMove(4, 'O'))
    .makeMove(TTTMove.fromMove(5, 'X'))
    .makeMove(TTTMove.fromMove(6, 'X'))
    .makeMove(TTTMove.fromMove(7, 'X'))
    .makeMove(TTTMove.fromMove(8, 'X'));
  const [gameState, setGameState] = useState<TicTacToeState>(initialState);

  const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0); //TODO use in game state creation
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isInDispute, setIsInDispute] = useState<boolean>(false);
  const [disputeAppealPlayer, sesDisputeAppealPlayer] = useState<string | null>(null);
  const [isDisputAvailable, setIsDisputeAvailavle] = useState<boolean>(false);
  const [conversationStatus, setConversationStatus] = useState<string | null>('not connected');
  const [rivalPlayerAddress, setRivalPlayerAddress] = useState<string | null>(
    null,
    // '0x3Be65C389F095aaa50D0b0F3801f64Aa0258940b',
  ); //TODO
  const [winner, setWinner] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerI[]>([]);
  const [lastOpponentMove, setLastOpponentMove] = useState<ISignedGameMove | null>(null);
  const [lastMove, setLastMove] = useState<ISignedGameMove | null>(null);
  const [isTimeoutInited, setIsTimeoutInited] = useState<boolean>(false);
  const [isResolveTimeOutAllowed, setIsResolveTimeOutAllowed] = useState<boolean>(false);
  const [isFinishTimeoutAllowed, setIsFinishTimeoutAllowed] = useState<boolean>(false);
  const [isTimeoutRequested, setIsTimeoutRequested] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<{ content: object; sender: string } | null>(
    null,
  );

  const { client, initClient } = useXmptContext();
  const { signer } = useWalletContext();
  const { query } = useRouter();
  const account = useAccount();

  const playersTypesMap = { 0: 'X', 1: 'O' };

  const setConversationHandler = async () => {
    if (!rivalPlayerAddress) {
      console.error('cant connect: no rival player address');
      return;
    }
    setRivalPlayerAddress(rivalPlayerAddress);
    if (!signer) return;
    console.log('before init client');
    initClient(signer);
    setGameState(new TicTacToeState(Number(gameId!), playerIngameId === 0 ? 'X' : 'O'));
  };

  const sendSignedMoveHandler = async (msg: ISignedGameMove) => {
    const messageText = JSON.stringify(msg);
    // console.log({ messageText });

    if (!conversation) {
      console.warn('no conversation!');
      return;
    }

    _isValidSignedMove(getArbiter(), msg).then((isValid) => {
      const nextGameState = gameState.encodedSignedMove(msg, isValid);
      console.log('nextGameState, check Winner', nextGameState);
      conversation.send(messageText).then(() => {
        console.log(
          'message sent, setting new state + winner:',
          nextGameState,
          nextGameState.winner, //0
        );
        setLastMove(msg);
        setGameState(nextGameState);
        console.log('new state is set after sending the move', gameState);

        if (nextGameState.winner !== null) {
          if (playerIngameId === nextGameState.winner) {
            runFinishGameHandler(msg);
            console.log('winner: ', account.address);
            const playerWhoWon = players.find((player) => player.address === account.address)!;

            setWinner(playerWhoWon.playerName);
          }
        }
      });
    });
  };

  const createNewGameHandler = async () => {
    // setCreatingNewGame(true);
    // setCreatingGameError(null);

    try {
      let { gameId } = await gameApi.proposeGame(
        gameApi.fromContractData(arbiterContractData),
        gameRulesContractData.address,
      );
      // console.log(gameId);
      if (!!gameId) {
        gameId = gameId.toString();
        // console.log('gameId', gameId);
        setGameId(gameId);
        setPlayerIngameId(PROPOSER_INGAME_ID);
        // setPlayerType(playersTypes[PROPOSER_INGAME_ID]);
        // setGameStatus('Proposed');
        // onProposeGame(gameId);
        // router.push('/games/' + gameType + '?prize=true');
      }
    } catch (error) {
      // setCreatingGameError('Failed to create new game');
      console.error(error);
      throw new Error('creating ');
    } finally {
      // setTimeout(() => setCreatingNewGame(false), 3000);
    }
  };

  const acceptGameHandler = async (gameId: string): Promise<void> => {
    // event.preventDefault();

    // @ts-ignore TODO: to solve once it make sense
    // const gameId = event.target.children.gameId.value;
    try {
      if (!account) throw new Error(`No wallet`);
      if (!gameId || gameId.length === 0) throw new Error(`Empty game id`);
      // setRivalPlayerAddress(null);
      // setRivalAddressStatus(null);
      // setGameId(null);
      // setGameStatus('Accepting...');
      // setError(null);
      const { players } = await gameApi.acceptGame(
        gameApi.fromContractData(arbiterContractData),
        gameId,
      );
      let rivalPlayer = players[PROPOSER_INGAME_ID];
      setRivalPlayerAddress(rivalPlayer);
      setPlayerIngameId(ACCEPTER_INGAME_ID);
      // setPlayerType(playersTypes[ACCEPTER_INGAME_ID]);
      // setGameStatus('Accepted');
      setGameId(gameId);
      // onAcceptGame(gameId);
    } catch (error) {
      // setError('Error! Check console!');
      console.error('Error: ', error);
      throw new Error('test error ');
    }
  };

  const initTimeoutHandler = async () => {
    console.log('initTimeout Handler');
    if (!lastOpponentMove) {
      console.log('no lastOpponentMove');
      return;
    }
    if (!lastMove) {
      console.log('no lastMove');
      return;
    }
    setIsTimeoutInited(true);
    setIsFinishTimeoutAllowed(true);
    setIsResolveTimeOutAllowed(false);
    try {
      let address = await getSigner().getAddress();
      const signature = await signMoveWithAddress(lastOpponentMove.gameMove, address);
      const signatures = [...lastOpponentMove.signatures, signature];
      let lastOpponentMoveSignedByAll = new SignedGameMove(
        lastOpponentMove.gameMove,
        signatures,
      );
      console.log('lastOpponentMoveSignedByAll', lastOpponentMoveSignedByAll);

      const initTimeoutResult = await initTimeout(getArbiter(), [
        lastOpponentMoveSignedByAll,
        lastMove,
      ]);
      console.log('initTimeoutResult', initTimeoutResult);
      if (!!conversation) {
        const message = { initTimeout: true };
        const messageText = JSON.stringify(message);
        conversation.send(messageText).then((message) => {
          console.log('message InitTimeout', message);

          // console.log('message sent, setting new state:', nextGameState);
          // setLastMove(msg);
          // setGameState(nextGameState);
          // console.log('new state is set after sending the move', gameState);
        });
        // console.warn('no conversation!');
        // return;
      }
    } catch (error) {
      setIsTimeoutInited(false);
      setIsFinishTimeoutAllowed(false);
      setIsResolveTimeOutAllowed(false);
    }
  };

  const resolveTimeoutHandler = async () => {
    console.log('resloveTimeout hangler');
    if (!lastMove) {
      console.log('no lastMove');
      return;
    }
    try {
      const resolveTimeoutResult = await resolveTimeout(getArbiter(), lastMove);
      console.log('resolveTimeoutResult', resolveTimeoutResult);
      if (!!conversation) {
        const message = { resolveTimeout: true };
        const messageText = JSON.stringify(message);
        conversation.send(messageText).then((message) => {
          console.log('message resloveTimeout', message);
        });
      }

      setIsTimeoutInited(false);
      setIsResolveTimeOutAllowed(false);
      setIsFinishTimeoutAllowed(false);
      setIsTimeoutRequested(false);
    } catch (error) {
      console.error(error);
    }
  };

  const finishTimeoutHandler = async () => {
    if (!gameId) {
      console.log('no gameId');
      return;
    }
    try {
      const finalizeTimeoutResult = await finalizeTimeout(getArbiter(), parseInt(gameId));
      console.log('finalizeTimeoutResult', finalizeTimeoutResult);
      console.log('finish timeout handler');
      setIsTimeoutInited(false);
      setIsFinishTimeoutAllowed(false);
      setIsTimeoutRequested(false);
    } catch (error) {
      console.error('finilize Timeout error:', error);
    }
  };

  const runDisputeHandler = async () => {
    setIsInDispute(true);
    const disputingPlayer = players.find((player) => player.address === account.address)!;
    sesDisputeAppealPlayer(disputingPlayer.playerName);
    // TODO: Add disputing messages
    console.log('run dispute');
    console.log('newMessage', newMessage); // Last Message with invalid move

    if (newMessage) {
      const signedMove = newMessage.content as ISignedGameMove;
      // console.log('moveToDispute', signedMove);
      const disputeMoveResult = await disputeMove(getArbiter(), signedMove);
      // console.log('Dispute move result', disputeMoveResult);
      // console.log('winner', disputeMoveResult.winner);
      // console.log('loser', disputeMoveResult.loser);
      // console.log('is Draw', disputeMoveResult.isDraw);
      // console.log('Player', players);
      const winPlayer = players.find((player) => player.address === disputeMoveResult.winner)!;

      // console.log('current Player', account.address);
      setWinner(winPlayer.playerName);
    }
    setIsInDispute(false);
    sesDisputeAppealPlayer(null);
  };

  const connectPlayerHandler = async () => {
    console.log('conntect timeout handle ');
  };

  const runFinishGameHandler = async (msg?: ISignedGameMove) => {
    if (!lastOpponentMove) {
      console.log('no lastOpponentMove');
      return;
    }
    if (!lastMove && !msg) {
      console.log('no lastMove');
      return;
    }

    let address = await getSigner().getAddress();
    const signature = await signMoveWithAddress(lastOpponentMove.gameMove, address);
    const signatures = [...lastOpponentMove.signatures, signature];
    let lastOpponentMoveSignedByAll = new SignedGameMove(
      lastOpponentMove.gameMove,
      signatures,
    );

    console.log('lastOpponentMoveSignedByAll', lastOpponentMoveSignedByAll);

    if (!!msg) {
      const finishGameResult = await finishGame(getArbiter(), [
        lastOpponentMoveSignedByAll,
        msg,
      ]);
      console.log('finishGameResult', finishGameResult);
      return;
    }

    if (!!lastMove) {
      const finishGameResult = await finishGame(getArbiter(), [
        lastOpponentMoveSignedByAll,
        lastMove,
      ]);
      console.log('finishGameResult', finishGameResult);
    }
  };

  useEffect(() => {
    if (!!rivalPlayerAddress) {
      // setConversationHandler(rivalPlayerAddress);
    }
  }, [rivalPlayerAddress]);

  useEffect(() => {
    if (!!client && !!rivalPlayerAddress) {
      setConversationStatus('Connecting...');

      client?.conversations
        .newConversation(rivalPlayerAddress)
        .then((newConversation) => {
          setConversation(newConversation);
          setConversationStatus('Connected');
          console.log('connected conv', newConversation);
        })
        .catch((error) => {
          console.log('Conversation error', error);
          setConversationStatus('Failed');
        });
    }
  }, [client]);

  // useEffect(() => {
  //   if (!!client && !!rivalPlayerAddress) {
  //     setConversationStatus('Connecting...');

  //     client?.conversations
  //       .newConversation(rivalPlayerAddress)
  //       .then((newConversation) => {
  //         setConversation(newConversation);
  //         setConversationStatus('Connected');
  //         console.log('connected conv', newConversation);
  //       })
  //       .catch((error) => {
  //         console.log('Conversation error', error);
  //         setConversationStatus('Failed');
  //       });
  //   }
  // }, [client]);

  useEffect(() => {
    let stream: Stream<Message>;
    if (!conversation) {
      // console.log('no conversation');
      return;
    }
    const streamMessages = async () => {
      stream = await conversation.streamMessages();
      for await (const msg of stream) {
        const messageContent = JSON.parse(msg.content);
        console.log('stream message contenet', messageContent);

        if (msg.senderAddress === rivalPlayerAddress) {
          console.log('incoming stream message contenet', messageContent);
          if (messageContent.initTimeout) {
            console.log('incoming stream timeout message', messageContent.initTimeout);
            setIsTimeoutInited(messageContent.initTimeout);
            setIsResolveTimeOutAllowed(messageContent.initTimeout);
            setIsFinishTimeoutAllowed(!messageContent.initTimeout);
            setIsTimeoutRequested(messageContent.initTimeout);
          } else if (messageContent.resolveTimeout) {
            console.log('incoming stream resolve timeout', messageContent.resolveTimeout);
            setIsTimeoutInited(!messageContent.resolveTimeout);
            setIsResolveTimeOutAllowed(!messageContent.resolveTimeout);
            setIsFinishTimeoutAllowed(!messageContent.resolveTimeout);
            setIsTimeoutRequested(!messageContent.resolveTimeout);
            return;
          } else {
            setNewMessage({ content: messageContent, sender: msg.senderAddress! });
            const signedMove = JSON.parse(msg.content) as ISignedGameMove;
            console.log('signedMove from stream', signedMove);
            console.log('gameState before move', gameState);

            _isValidSignedMove(getArbiter(), signedMove).then((isValid) => {
              const nextGameState = gameState.opponentSignedMove(signedMove, isValid);
              console.log('signedMove', decodeEncodedBoardState(signedMove.gameMove.newState)); //check winner
              setLastOpponentMove(signedMove);

              console.log('nextGameState + winner', nextGameState, nextGameState.winner);
              setGameState(nextGameState);
              setIsInvalidMove(!isValid);
              const decodedSignedMove = decodeEncodedBoardState(signedMove.gameMove.newState);
              if (decodedSignedMove[1]) {
                console.log('Winneer Propposer');
                if (playerIngameId === PROPOSER_INGAME_ID) {
                  console.log('current player is proposer and wis');
                  const winPlayer = players.find(
                    (player) => player.address === account.address,
                  )!;
                  setWinner(winPlayer.playerName);
                } else {
                  console.log('current player is accepter and wis');
                  const winPlayer = players.find(
                    (player) => player.address === rivalPlayerAddress,
                  )!;
                  setWinner(winPlayer.playerName);
                }
                // runFinishGameHandler();
              }
              if (decodedSignedMove[2]) {
                console.log('winner acceptor');
                if (playerIngameId === PROPOSER_INGAME_ID) {
                  console.log('current player 2 is proposer and wis');
                  const winPlayer = players.find(
                    (player) => player.address === rivalPlayerAddress,
                  )!;
                  setWinner(winPlayer.playerName);
                } else {
                  console.log('current player 2 is accepter and wis');
                  const winPlayer = players.find(
                    (player) => player.address === account.address,
                  )!;
                  setWinner(winPlayer.playerName);
                }
                // runFinishGameHandler();
              }
            });
          }
        }
      }
    };

    streamMessages();
    return () => {
      if (!!stream) stream.return();
    };
  }, [conversation, gameState]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation) {
        // console.warn('no conversation');
        return [];
      }
      const msgs = await conversation.messages();
      const sortedMessages = msgs
        .sort((msg1, msg2) => msg2.sent!.getTime() - msg1.sent!.getTime())
        .map(({ id, senderAddress, recipientAddress, sent, content }) => ({
          id,
          sender: senderAddress!,
          recepient: recipientAddress!,
          timestamp: sent!.getTime(),
          content,
        }));
      return sortedMessages;
    };
    setIsLogLoading(true);

    fetchMessages()
      .then((data) => {
        setLog(data!);
      })
      .finally(() => {
        setIsLogLoading(false);
      });
  }, [conversation, gameState]);

  useEffect(() => {
    setPlayers([
      {
        playerName: playerIngameId === 0 ? 'Player1' : 'Player2',
        address: gameId && account.address ? account.address : null,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[playerIngameId],
      },
      {
        playerName: playerIngameId === 1 ? 'Player1' : 'Player2',
        address: rivalPlayerAddress,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[playerIngameId === 0 ? 1 : 0],
      },
    ]);
  }, [rivalPlayerAddress, gameId]);

  useEffect(() => {
    console.log('newMessage', newMessage?.sender);
    console.log('isInvalidMove', isInvalidMove);
    if (newMessage?.sender === rivalPlayerAddress && isInvalidMove) {
      setIsDisputeAvailavle(true);
      return;
    }
    setIsDisputeAvailavle(false);
  }, [newMessage, isInvalidMove]);

  useInterval(async () => {
    if (rivalPlayerAddress) {
      return;
    }
    if (!gameId) {
      return;
    }
    console.log('in poller');
    let players: [string, string] = await gameApi.getPlayers(
      gameApi.fromContractData(arbiterContractData),
      gameId,
    );
    let rivalPlayer = players[playerIngameId == 0 ? 1 : 0];
    if (rivalPlayer == ZERO_ADDRESS) {
      return;
    }
    if (rivalPlayer) {
      // setRivalAddressStatus(null);
      setRivalPlayerAddress(rivalPlayer);
    } else {
      // setRivalAddressStatus('Failed to get rival address');
      setRivalPlayerAddress(null);
    }
  }, FETCH_RIVAL_ADDRESS_TIMEOUT);

  if (!!gameType && !!query && query?.join === 'true') {
    return <JoinGame acceptGameHandler={acceptGameHandler} />;
  }
  if (!!gameType && !!query && query?.select === 'true') {
    return (
      <SelectGame
        userName={account.address}
        gameType={gameType}
        // onProposeGame={setGameId}
        // arbiterContractData={{
        //   abi: arbiterContract.abi,
        //   address: arbiterContract.address,
        // }}
        // gameRulesContractData={{
        //   abi: rulesContract.abi,
        //   address: rulesContract.address,
        // }}
      />
    );
  }

  if (!!gameType && !!query && query?.prize === 'true') {
    console.log('prize', query?.prize, query?.gameId);
    return <SelectPrize gameId={gameId} createNewGameHandler={createNewGameHandler} />;
  }

  console.log('gameId12341234', gameId);
  console.log('conversation', conversation, !!conversation);
  if (!!gameType && gameType === 'tic-tac-toe') {
    return (
      <div className={styles.container}>
        {/* <ControlPanel
          arbiterContractData={{
            abi: arbiterContract.abi,
            address: arbiterContract.address,
          }}
          gameRulesContractData={{
            abi: rulesContract.abi,
            address: rulesContract.address,
          }}
          playersTypes={{ 0: 'X', 1: 'O' }}
          onConnectPlayer={setConversationHandler}
          onSetPlayerIngameId={setPlayerIngameId}
          winner={winner}
          rivalPlayerConversationStatus={conversationStatus}
          onProposeGame={setGameId}
          onAcceptGame={setGameId}
          isInvalidMove={isInvalidMove}
          isInDispute={isInDispute}
          onDispute={runDisputeHandler}
          gameId={gameId}
        /> */}
        <LeftPanel
          players={players}
          isTimeoutAllowed={!!lastOpponentMove && !!lastMove && !isTimeoutInited}
          // isTimeoutAllowed={!isTimeoutInited}
          initTimeout={initTimeoutHandler}
          isResolveTimeoutAllowed={!!lastMove && isResolveTimeOutAllowed}
          // isResolveTimeoutAllowed={isResolveTimeOutAllowed}
          resolveTimeout={resolveTimeoutHandler}
          isFinishTimeOutAllowed={isFinishTimeoutAllowed}
          finishTimeout={finishTimeoutHandler}
          isTimeoutRequested={isTimeoutRequested}
          // isTimeoutRequested={true}
          onRunDisput={runDisputeHandler}
          isDisputAvailable={isDisputAvailable}
          // connectPlayer={connectPlayerHandler}
        />
        <GameField
          gameId={gameId}
          rivalPlayerAddress={rivalPlayerAddress}
          isConnected={!!conversation}
          isInDispute={isInDispute}
          disputeAppealPlayer={disputeAppealPlayer}
          winner={winner}
          onConnect={setConversationHandler}
        >
          <ETTicTacToe
            gameState={gameState}
            getSignerAddress={() => {
              return getSigner().getAddress();
            }}
            sendSignedMove={sendSignedMoveHandler}
          />
        </GameField>

        {/* <XMTPChatLog logData={log} isLoading={isLogLoading} /> */}
      </div>
    );
  }
  return <div>No Games Available</div>;
};

export const getStaticProps: GetStaticProps<IGamePageProps, IParams> = (context) => {
  console.log('context', context.params?.gameType);
  return {
    props: {
      gameType: context.params?.gameType,
    },
  };
};

export const getStaticPaths: GetStaticPaths<IParams> = () => {
  const gamesType = ['tic-tac-toe', 'other'];
  const paths = gamesType.map((gameType) => ({ params: { gameType } }));
  return {
    paths,
    fallback: false,
  };
};

export default Game;
