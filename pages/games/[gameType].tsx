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
import { TicTacToeState, TTTMove } from '../../components/Games/ET-Tic-Tac-Toe/types';
import { IChatLog } from '../../types';
import { _isValidSignedMove, checkIsValidMove, getArbiter, getSigner } from '../../gameApi';
import { ISignedGameMove } from '../../types/arbiter';
import { PlayerI } from 'types';
import { GameField, JoinGame, LeftPanel, SelectGame, SelectPrize } from 'components';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import gameApi from 'gameApi';

interface IGamePageProps {
  gameType?: string;
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}
const PROPOSER_INGAME_ID = '0';
const ACCEPTER_INGAME_ID = '1';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const FETCH_RIVAL_ADDRESS_TIMEOUT = 2500;

const arbiterContractData = {
  abi: arbiterContract.abi,
  address: arbiterContract.address,
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
  const [conversationStatus, setConversationStatus] = useState<string | null>('not connected');
  const [rivalPlayerAddress, setRivalPlayerAddress] = useState<string | null>(
    null,
    // '0x3Be65C389F095aaa50D0b0F3801f64Aa0258940b',
  ); //TODO
  const [newMessage, setNewMessage] = useState<{ content: string; sender: string } | null>(
    null,
  );
  const [winner, setWinner] = useState<0 | 1 | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerI[]>([]);

  const { client, initClient } = useXmptContext();
  const { signer } = useWalletContext();
  const { query } = useRouter();
  const account = useAccount();

  const playersTypesMap = { 0: 'X', 1: 'O' };

  const setConversationHandler = async (rivalPlayerAddress: string) => {
    console.log('setConversationHandler');
    setRivalPlayerAddress(rivalPlayerAddress);
    if (!signer) return;
    console.log('before init client');
    initClient(signer);
    setGameState(new TicTacToeState(Number(gameId!), playerIngameId === 0 ? 'X' : 'O'));
  };

  const sendSignedMoveHandler = async (msg: ISignedGameMove) => {
    const messageText = JSON.stringify(msg);
    console.log({ messageText });

    if (!conversation) {
      console.warn('no conversation!');
      return;
    }

    _isValidSignedMove(getArbiter(), msg).then((isValid) => {
      const nextGameState = gameState.encodedMove(msg.gameMove.move, isValid);
      conversation.send(messageText).then(() => {
        console.log('message sent, setting new state:', nextGameState);
        setGameState(nextGameState);
        console.log('new state is set after sending the move', gameState);
      });
    });

    // const message = new Message(
    //     `game_${msg.gameMove.gameId}_player_${msg.gameMove.player}_${msg.gameMove.nonce}`,
    //     messageText,
  };

  const runDisputeHandler = () => {
    setIsInDispute(true);
    // TODO: Add disputing messages
    console.log('run dispute');
    console.log('moveToDispute:', newMessage); // LAst Message with invalid move
  };

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

        if (msg.senderAddress === rivalPlayerAddress) {
          setNewMessage({ content: messageContent, sender: msg.senderAddress! });
          const signedMove = JSON.parse(msg.content) as ISignedGameMove;
          console.log('signedMove from stream', signedMove);
          console.log('gameState before move', gameState);

          _isValidSignedMove(getArbiter(), signedMove).then((isValid) => {
            const nextGameState = gameState.opponentMove(signedMove.gameMove.move, isValid);
            console.log('nextGameState', nextGameState);
            setGameState(nextGameState);
          });
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
        address: account.address ? account.address : null,
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
  }, [rivalPlayerAddress]);

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
    return <JoinGame />;
  }
  if (!!gameType && !!query && query?.select === 'true') {
    return (
      <SelectGame
        userName={account.address}
        gameType={gameType}
        onProposeGame={setGameId}
        arbiterContractData={{
          abi: arbiterContract.abi,
          address: arbiterContract.address,
        }}
        gameRulesContractData={{
          abi: rulesContract.abi,
          address: rulesContract.address,
        }}
      />
    );
  }
  if (!!gameType && !!query && query?.prize === 'true') {
    console.log('prize', query?.prize, query?.gameId);
    return <SelectPrize gameId={gameId} />;
  }

  if (!!gameType && gameType === 'tic-tac-toe') {
    return (
      <div className={styles.container}>
        <ControlPanel
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
        />
        <LeftPanel players={players} />
        <GameField>
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
