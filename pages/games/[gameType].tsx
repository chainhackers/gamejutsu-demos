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
import { IChatLog } from 'types';

import { signMove, getSessionWallet } from 'helpers/session_signatures';

import styles from 'pages/games/gameType.module.scss';
import { ethers } from 'ethers';

interface IGamePageProps {
  gameType?: string;
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}

// const [rivalPlayerConversationStatus, setRivalPlayerConversationStatus] = useState<
//   string | null
// >(null);
// const rivalPlayerAddress =
// currentPlayerAddress === '0x1215991085d541A586F0e1968355A36E58C9b2b4'
//   ? '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91'
//   : '0x1215991085d541A586F0e1968355A36E58C9b2b4';

const Game: NextPage<IGamePageProps> = ({ gameType }) => {
  const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isInDispute, setIsInDispute] = useState<boolean>(false);
  const [conversationStatus, setConversationStatus] = useState<string | null>('not connected');
  const [rivalPlayerAddress, setRivalPlayerAddress] = useState<string | null>(null);
  // const [rivalPlayerConversationStatus, setRivalPlayerConversationStatus] = useState<
  //   string | null
  // >(null);
  // const rivalPlayerAddress =
  // currentPlayerAddress === '0x1215991085d541A586F0e1968355A36E58C9b2b4'
  //   ? '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91'
  //   : '0x1215991085d541A586F0e1968355A36E58C9b2b4';
  const [newMessage, setNewMessage] = useState<{ content: string; sender: string } | null>(
    null,
  );
  const [winner, setWinner] = useState<0 | 1 | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);
  const [log, setLog] = useState<IChatLog[]>([]);
  const [isLogLoading, setIsLogLoading] = useState<boolean>(true);

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
  }, [conversation, newMessage]);

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
        <TicTacToe
          gameId={gameId}
          // playerType={playerType}
          playerIngameId={playerIngameId}
          encodedMessage={newMessage}
          onChangeMessage={onGameStateChangeHandler}
          onInvalidMove={inValidMoveHandler}
          onWinner={setWinner}
        />
        <XMTPChatLog logData={log} isLoading={isLogLoading} />
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
