import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Conversation, Stream, Message } from '@xmtp/xmtp-js';
import { useXmptContext } from 'context/XmtpContext';

import { TicTacToe } from 'components/Games';
import { XMTPChatLog } from 'components/XMTPChatLog';
import { useWalletContext } from 'context/WalltetContext';
import { ControlPanel } from 'components/ControlPanel';

import arbiterContract from 'contracts/Arbiter.json';
import rulesContract from 'contracts/TicTacToeRules.json';

import styles from 'pages/games/gameType.module.scss';

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
  const [newMessage, setNewMessage] = useState<{ content: string; sender: string } | null>(
    null,
  );
  const [winner, setWinner] = useState<0 | 1 | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);

  const { client, initClient } = useXmptContext();
  const { signer } = useWalletContext();

  const setConversationHandler = async (rivalPlayerAddress: string) => {
    setRivalPlayerAddress(rivalPlayerAddress);
    if (!signer) return;
    initClient(signer);
  };

  const sendMessageHandler = async (state: any) => {
    const messageText = JSON.stringify(state);
    if (!conversation) {
      console.warn('no conversation!');
      return;
    }

    await conversation.send(messageText);
  };

  const onChangeHandler = (encodedMessage: string) => {
    // TODO: Signing messages
    sendMessageHandler(encodedMessage);
  };

  const inValidMoveHandler = () => {
    setIsInvalidMove(true);
  };

  const runDisputeHandler = () => {
    setIsInDispute(true);
    // TODO: Add disputing messages
    console.log(newMessage); // LAst Message with invalid move
    console.log('run dispute');
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
        <TicTacToe
          gameId={gameId}
          // playerType={playerType}
          playerIngameId={playerIngameId}
          encodedMessage={newMessage}
          onChangeMessage={onChangeHandler}
          onInvalidMove={inValidMoveHandler}
          onWinner={setWinner}
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
