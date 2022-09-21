import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Conversation, Stream, Message } from '@xmtp/xmtp-js';
import { useAccount } from 'wagmi';
import { useXmptContext } from 'context/XmtpContext';

import { TicTacToe } from 'components/Games';
import { XMTPChatLog } from 'components/XMTPChatLog';
import { useWalletContext } from 'context/WalltetContext';
import { ControlPanel } from 'components/ControlPanel';
import { defaultAbiCoder } from 'ethers/lib/utils';
import arbiterContract from 'contracts/Arbiter.json';
import rulesContract from 'contracts/TicTacToeRules.json';

import { signMove, getSessionWallet } from 'helpers/session_signatures';

import styles from 'pages/games/gameType.module.scss';
import { ethers } from 'ethers';
import {ETTicTacToe} from "../../components/Games/ET-Tic-Tac-Toe";
import {TicTacToeState, TTTMove} from "../../components/Games/ET-Tic-Tac-Toe/types";

interface IGamePageProps {
  gameType?: string;
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}

const Game: NextPage<IGamePageProps> = ({ gameType }) => {
  const initialState =  new TicTacToeState(1, 'X')
      .makeMove(TTTMove.fromMove(5, 'O'))
      .makeMove(TTTMove.fromMove(6, 'X'))
  const [gameState, setGameState] = useState<TicTacToeState>(initialState);

  const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0); //TODO use in game state creation
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isInDispute, setIsInDispute] = useState<boolean>(false);
  const [conversationStatus, setConversationStatus] = useState<string | null>('not connected');
  const [rivalPlayerAddress, setRivalPlayerAddress] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<{ content: string; sender: string } | null>(
    null,
  );
  const [winner, setWinner] = useState<0 | 1 | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);

  const { client, initClient } = useXmptContext();
  const { signer } = useWalletContext();
  const account = useAccount();

  const setConversationHandler = async (rivalPlayerAddress: string) => {
    setRivalPlayerAddress(rivalPlayerAddress);
    if (!signer) return;
    initClient(signer);
  };

  const sendMessageHandler = async ({
    gameMove,
    signatures,
  }: {
    gameMove: any;
    signatures: string[];
  }) => {
    const messageText = JSON.stringify({ gameMove, signatures });
    if (!conversation) {
      console.warn('no conversation!');
      return;
    }

    await conversation.send(messageText);
  };

  const onGameStateChangeHandler = async (
    encodedMessage: string,
    gameMove: { nonce: number; oldState: string; newState: string; move: string },
  ) => {
    // TODO: Signing messages
    if (!account.address) {
      console.warn('No wallet connected');
      return;
    }
    // console.log('onGameStateChangeHandler gameMove:', gameMove);

    // const decodedNewState = defaultAbiCoder.decode(
    //   ['uint8[9]', 'bool', 'bool'],
    //   gameMove.newState,
    // );
    // const decodedOldState = defaultAbiCoder.decode(
    //   ['uint8[9]', 'bool', 'bool'],
    //   gameMove.oldState,
    // );

    // console.log('onGameStateChangeHandler gameMove, decoded newState', decodedNewState);
    // console.log('onGameStateChangeHandler gameMove, decoded oldState', decodedOldState);

    // const encodedMove = defaultAbiCoder.encode(['uint8'], [gameMove.move]);
    const structureToSign: {
      gameId: number;
      nonce: number;
      player: string;
      oldState: string;
      newState: string;
      move: string;
    } = {
      gameId: Number(gameId),
      nonce: gameMove.nonce,
      player: account.address,
      oldState: gameMove.oldState,
      newState: gameMove.newState,
      move: gameMove.move,
    };
    console.log('onChangeHandler structureToSign: ', structureToSign);
    // const encondedstructureToSign = defaultAbiCoder.encode(['uint8']);

    const cb = (wallet: ethers.Wallet) => Promise.resolve();

    const signature = await signMove(
      structureToSign,
      await getSessionWallet(Number(gameId), account.address, cb),
    );

    console.log('outgoing signature', signature);

    // console.log('GameMove signature, nonce: ', gameMove.nonce, signature);

    // struct SignedGameMove {
    //     GameMove gameMove;
    //     bytes[] signatures;
    // }

    sendMessageHandler({ gameMove, signatures: [signature] });
  };

  const inValidMoveHandler = () => {
    setIsInvalidMove(true);
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
        setNewMessage({ content: messageContent, sender: msg.senderAddress! });
      }
    };

    streamMessages();
    return () => {
      if (!!stream) stream.return();
    };
  }, [conversation]);

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
          isInvalidMove={isInvalidMove}
          isInDispute={isInDispute}
          onDispute={runDisputeHandler}
        />
        <ETTicTacToe
          gameState={gameState}
          setGameState={setGameState}
        />
        <XMTPChatLog logData={[]} isLoading={false} />
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
