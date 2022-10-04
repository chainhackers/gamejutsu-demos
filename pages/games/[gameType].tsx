import { useEffect, useState, useRef } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Conversation, Stream, Message } from '@xmtp/xmtp-js';
import { useXmptContext } from 'context/XmtpContext';

import { XMTPChatLog } from 'components/XMTPChatLog';
import { useWalletContext } from 'context/WalltetContext';
import { ControlPanel } from 'components/ControlPanel';
import {
  GameField,
  JoinGame,
  LeftPanel,
  RightPanel,
  SelectGame,
  SelectPrize,
} from 'components';

import styles from 'pages/games/gameType.module.scss';
import {ETTicTacToe} from "components/Games/ET-Tic-Tac-Toe";
import {TicTacToeBoard, TicTacToeState, TTTMove} from "components/Games/ET-Tic-Tac-Toe/types";
import {IChatLog, PlayerI} from "../../types";
import gameApi, {_isValidSignedMove, getArbiter, getSigner, getRulesContract, finishGame, disputeMove, initTimeout, resolveTimeout, finalizeTimeout, FinishedGameState} from "../../gameApi";
import {ISignedGameMove, SignedGameMove} from "../../types/arbiter";
import { signMoveWithAddress } from 'helpers/session_signatures';
import { useAccount } from 'wagmi';
import { Checkers } from 'components/Games/Checkers';
import {CheckersBoard, CheckersState} from 'components/Games/Checkers/types';
import { useRouter } from 'next/router';
import {IGameState, IMyGameBoard, TPlayer} from 'components/Games/types';

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

    const initialTicTacToeState = new TicTacToeState({ gameId: 1, playerType: 'X' });

    const getInitialState = (gameId: number, playerType: TPlayer) => {
        let initialCheckersState = new CheckersState(gameId, playerType);
        return initialCheckersState;
    }


    const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0); //TODO use in game state creation
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [isInDispute, setIsInDispute] = useState<boolean>(false);
    const [conversationStatus, setConversationStatus] = useState<string | null>('not connected');
    const [newMessage, setNewMessage] = useState<{ content: object; sender: string } | null>(null);
    const [lastMove, setLastMove] = useState<ISignedGameMove | null>(null);
    const [lastOpponentMove, setLastOpponentMove] = useState<ISignedGameMove | null>(null);
    const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);
    const [gameId, setGameId] = useState<string | null>(null);

    const [isDisputAvailable, setIsDisputeAvailavle] = useState<boolean>(false);

    const [rivalPlayerAddress, setRivalPlayerAddress] = useState<string | null>(null,);


    const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);
    const [players, setPlayers] = useState<PlayerI[]>([]);


    const [isTimeoutInited, setIsTimeoutInited] = useState<boolean>(false);
    const [isResolveTimeOutAllowed, setIsResolveTimeOutAllowed] = useState<boolean>(false);
    const [isFinishTimeoutAllowed, setIsFinishTimeoutAllowed] = useState<boolean>(false);
    const [isTimeoutRequested, setIsTimeoutRequested] = useState<boolean>(false);


    const { client, initClient } = useXmptContext();
    const { signer } = useWalletContext();
    const { query } = useRouter();
    const account = useAccount();

    const playersTypesMap = { 0: 'X', 1: 'O' };


    let gameState: IGameState<any, any>;
    let setGameState: ((arg0: any) => void);
    if (gameType == 'tic-tac-toe') {
        [gameState, setGameState] = useState<IGameState<any, any>>(initialTicTacToeState);
    } else
    {
        [gameState, setGameState] = useState<IGameState<any, any>>(getInitialState(1, 'X'));
    }

    const setConversationHandler = async (rivalPlayerAddress: string) => {
        if (!rivalPlayerAddress) {
            console.error('cant connect: no rival player address');
            return;
        }
        setRivalPlayerAddress(rivalPlayerAddress);
        if (!signer) return;
        console.log('before init client');
        initClient(signer);
        if (gameType == 'tic-tac-toe') {
            setGameState(new TicTacToeState({ gameId: Number(gameId!), playerType: playerIngameId === 0 ? 'X' : 'O' }));
        } else {
            setGameState(getInitialState(Number(gameId), playerIngameId === 0 ? 'X' : 'O'));
        }
    };

    const sendSignedMoveHandler = async (signedMove: ISignedGameMove) => {
        const messageText = JSON.stringify({...signedMove, gameType});

        if (!conversation) {
          console.warn('no conversation!');
          return;
        }

        if(gameType == 'tic-tac-toe'){
          console.log('oldState.fromEncoded', TicTacToeBoard.fromEncoded(signedMove.gameMove.oldEncodedGameBoard));
          console.log('newState.fromEncoded', TicTacToeBoard.fromEncoded(signedMove.gameMove.newEncodedGameBoard));
        } else if(gameType == 'checkers'){
          console.log('oldState.fromEncoded', CheckersBoard.fromEncoded(signedMove.gameMove.oldEncodedGameBoard));
          console.log('newState.fromEncoded', CheckersBoard.fromEncoded(signedMove.gameMove.newEncodedGameBoard));
        }

        _isValidSignedMove(getArbiter(), signedMove).then((isValid) => {
          const nextGameState = gameState.makeNewGameStateFromSignedMove(signedMove, isValid);
          console.log('nextGameState, check Winner', nextGameState);
          conversation.send(messageText).then(() => {
            console.log(
              'message sent, setting new state + winner:',
              nextGameState,
              nextGameState.winner, //0
            );
            setLastMove(signedMove);
            setGameState(nextGameState);
            console.log('new state is set after sending the move', gameState);

            if (nextGameState.winner !== null) {
              if (playerIngameId === nextGameState.winner) {
                runFinishGameHandler(signedMove);
              }
            }
          });
        });
      };

    const runFinishGameHandler = async (signedGameMove?: ISignedGameMove) => {
        if (!lastOpponentMove) {
            console.log('no lastOpponentMove');
            throw 'no lastOpponentMove';
        }

        if (!lastMove && !signedGameMove) {
            console.log('no lastMove');
            throw 'no lastMove'
        }

        let address = await getSigner().getAddress();
        const signature = await signMoveWithAddress(lastOpponentMove.gameMove, address);
        const signatures = [...lastOpponentMove.signatures, signature];
        let lastOpponentMoveSignedByAll = new SignedGameMove(
            lastOpponentMove.gameMove,
            signatures,
        );

        console.log('lastOpponentMoveSignedByAll', lastOpponentMoveSignedByAll);

        if (!!signedGameMove) {
            const finishGameResult = await finishGame(getArbiter(), [
                lastOpponentMoveSignedByAll,
                signedGameMove,
            ]);
            console.log('finishGameResult', finishGameResult);
            return;
        } else
        if (!!lastMove) {
            const finishGameResult = await finishGame(getArbiter(), [
                lastOpponentMoveSignedByAll,
                lastMove,
            ]);
            console.log('finishGameResult', finishGameResult);
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
              });
            }
        } catch (error) {
            setIsTimeoutInited(false);
            setIsFinishTimeoutAllowed(false);
            setIsResolveTimeOutAllowed(false);
            throw error;
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
          throw error;
        }
      };



  const createNewGameHandler = async (isPaid: boolean = false) => {
    console.log('isPaid', isPaid);

    try {
      let { gameId } = await gameApi.proposeGame(
        getArbiter(),
        getRulesContract(gameType).address,
        isPaid,
      );
    
      if (!!gameId) {
        gameId = gameId.toString();
      
        setGameId(gameId);
        setPlayerIngameId(PROPOSER_INGAME_ID);
        
      }
    } catch (error) {
      // setCreatingGameError('Failed to create new game');
      console.error(error);
      throw error;
    } finally {
      // setTimeout(() => setCreatingNewGame(false), 3000);
    }
  };

  const acceptGameHandler = async (gameId: string, stake: string): Promise<void> => {
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
          getArbiter(),
        gameId,
        stake,
      );
      let rivalPlayer = players[PROPOSER_INGAME_ID];
      setRivalPlayerAddress(rivalPlayer);
      setPlayerIngameId(ACCEPTER_INGAME_ID);
      // setGameStatus('Accepted');
      setGameId(gameId);
      // onAcceptGame(gameId);
    } catch (error) {
      // setError('Error! Check console!');
      console.error('Error: ', error);
      throw error;
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
      throw error;
    }
  };

  const runDisputeHandler = async () => {
    setIsInDispute(true);
    console.log('run dispute');
    console.log('newMessage', newMessage); // Last Message with invalid move

    if (newMessage) {
      const signedMove = newMessage.content as ISignedGameMove;
      // console.log('moveToDispute', signedMove);
      const finishGameResult = await disputeMove(getArbiter(), signedMove);
      setFinishedGameState(finishGameResult);
    }
    setIsInDispute(false);
  };

  const connectPlayerHandler = async () => {
    console.log('conntect timeout handle ');
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

        //all events 

        if (msg.senderAddress === rivalPlayerAddress) {

          //incoming events

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
              const nextGameState = gameState.makeNewGameStateFromOpponentsSignedMove(signedMove, isValid);
              let decodedState: IMyGameBoard<any> | null = null;
              let winner: TPlayer | null = null;
              if(gameType == 'tic-tac-toe'){
                  winner = TicTacToeBoard.fromEncoded(signedMove.gameMove.newEncodedGameBoard).getWinner();
              } else if(gameType == 'checkers'){
                  winner = CheckersBoard.fromEncoded(signedMove.gameMove.newEncodedGameBoard).getWinner();
              }
              console.log('signedMove new state:', decodedState); //check winner
              setLastOpponentMove(signedMove);

              console.log('nextGameState + winner', nextGameState, nextGameState.winner);
              setGameState(nextGameState);
              setIsInvalidMove(!isValid);

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
      //TODO Add fetch with offset or filter out old games
      //deduplicate with chat component
      const opts = {
        // startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
        // endTime: new Date(),
      }
      const msgs = await conversation.messages(opts);
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
      getArbiter(),
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
      />
    );
  }

  if (!!gameType && !!query && query?.prize === 'true') {
    console.log('prize', query?.prize, query?.gameId);
    return <SelectPrize gameId={gameId} createNewGameHandler={createNewGameHandler} />;
  }

  let gameComponent = null;
    if (gameType === 'tic-tac-toe') {
        gameComponent = <ETTicTacToe
        gameState={gameState as TicTacToeState}
        getSignerAddress={() => {
            return getSigner().getAddress()
        }}
        sendSignedMove={sendSignedMoveHandler}
    />
    }
    if (gameType === 'checkers') {
        gameComponent = <div className={styles.container}>
        <ControlPanel
            gameId={gameId}
            gameType={gameType}
            playersTypes={{0: 'X', 1: 'O'}}
            onConnectPlayer={setConversationHandler}
            onSetPlayerIngameId={setPlayerIngameId}
            finishedGameState={finishedGameState}
            rivalPlayerConversationStatus={conversationStatus}
            onProposeGame={setGameId}
            onAcceptGame={setGameId}
            isInvalidMove={isInvalidMove}
            isInDispute={isInDispute}
            onFinishGame={runFinishGameHandler}
            onDispute={runDisputeHandler}
            onInitTimeout={initTimeoutHandler}
            onResolveTimeout={resolveTimeoutHandler}
            onFinalizeTimeout={initTimeoutHandler}
        />
        <Checkers
        gameState={gameState as CheckersState}
        getSignerAddress={() => {
            return getSigner().getAddress()
        }}
        sendSignedMove={sendSignedMoveHandler}
        />
        </div>
    }
    if(gameComponent) {
        if (gameType === 'checkers') {
            return (
                <div className={styles.container}>
                    {gameComponent}

                    <RightPanel>
                        <XMTPChatLog
                            logData={log}
                            isLoading={isLogLoading}/>
                    </RightPanel>
                </div>
            );
        } else if (gameType === 'tic-tac-toe') {
            return (
                <div className={styles.container}>
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
                        finishedGameState={finishedGameState}
                        onConnect={setConversationHandler}
                    >
                        {gameComponent}
                    </GameField>
                    <RightPanel>
                        <XMTPChatLog logData={log} isLoading={isLogLoading}/>
                    </RightPanel>
                </div>
            );
        }
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
    const gamesType = ['tic-tac-toe', 'checkers', 'other'];
    const paths = gamesType.map((gameType) => ({params: {gameType}}));
    return {
        paths,
        fallback: false,
    };
};

export default Game;
