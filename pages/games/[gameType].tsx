import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { TicTacToe } from 'components/Games';
import { XMTPChatLog } from 'components/XMTPChatLog';
import { ParsedUrlQuery } from 'querystring';
import { Conversation, Stream, Message } from '@xmtp/xmtp-js';
import { useXmptContext } from 'context/XmtpContext';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWalletContext } from 'context/WalltetContext';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ControlPanel } from 'components/ControlPanel';
import { AbiItem } from 'web3-utils';

import arbiterContract from 'contracts/Arbiter2.json';
import rulesContract from 'contracts/TicTacToeRules.json';
import { TGameState } from 'components/Games/Tic-Tac-Toe/types';
import styles from 'pages/games/gameType.module.scss';
import { useEffect, useState } from 'react';
import { sign } from 'crypto';
interface IGamePageProps {
  gameType?: string;
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}

const Game: NextPage<IGamePageProps> = ({ gameType }) => {
  const account = useAccount();
  const connect = useConnect();
  const disconnect = useDisconnect();
  // console.log('account', account);
  // console.log('connect', connect);
  // console.log('disconnect', disconnect);
  // console.log('InjectedConnector', InjectedConnector);
  const [playerType, setPlayerType] = useState<'X' | 'O' | null>('X');
  const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversationStatus, setConversationStatus] = useState<string | null>('not connected');
  const [rivalPlayerAddress, setRivalPlayerAddress] = useState<string | null>(null);
  const [gameState, setGameState] = useState<TGameState>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    false,
    false,
  ]);

  const [winner, setWinner] = useState<0 | 1 | null>(null);

  const { client, initClient } = useXmptContext();
  const { address, signer } = useWalletContext();

  const getClient = () => client;

  // const addRivalPlayerHandler = async () => {
  //   const isInNetwork = !!newPlayerInputValue
  //     ? await checkIfOnNetwork(newPlayerInputValue)
  //     : false;
  //   if (!!isInNetwork && !!newPlayerInputValue) {
  //     const newConversation = await client?.conversations.newConversation(
  //       newPlayerInputValue,
  //     )!;
  //     if (!newConversation) {
  //       console.error('no conversation');
  //       return;
  //     }
  //     setConversation(newConversation);
  //   }
  // };

  const setConversationHandler = async (rivalPlayerAddress: string) => {
    setRivalPlayerAddress(rivalPlayerAddress);
    if (!signer) return;
    initClient(signer);
    // const connectConverstaion = async () => {
    //   const timeout = setTimeout(async () => {
    //     console.log('set Convertsation', getClient());
    //     clearTimeout(timeout);
    //     if (!!client) {
    //       const newConversation = await client?.conversations.newConversation(
    //         rivalPlayerAddress,
    //       )!;
    //       setConversation(newConversation);

    //       return;
    //     }
    //     connectConverstaion();
    //   }, 2000);
    // };

    // console.log('setConversationHandler', rivalPlayerAddress);
    // console.log('client', client);
    // if (!!signer) {
    //   initClient(signer);

    //   const timer = setTimeout(async () => {
    //     if (!!client) {
    //       const newConversation = await client?.conversations.newConversation(
    //         rivalPlayerAddress,
    //       )!;
    //       clearTimeout(timer);
    //       return;
    //     }
    //   }, 2000);
    // }
    // const newConversation = await client?.conversations.newConversation(rivalPlayerAddress)!;
    // console.log('new conversation', newConversation);
    // connectConverstaion();
  };

  const sendMessageHandler = async (state: any) => {
    const messageText = JSON.stringify(state);
    if (!conversation) {
      console.warn('no conversation!');
      return;
    }
    await conversation.send(messageText);
  };

  const gameStateChangeHandler = (newGameState: any[]) => {
    console.log('new game state', newGameState);
    sendMessageHandler(newGameState);
  };

  useEffect(() => {
    console.log('conversation', conversation);
  }, [conversation]);

  useEffect(() => {
    if (!!client && !!rivalPlayerAddress) {
      setConversationStatus('Connecting...');
      console.log('has client');
      client?.conversations
        .newConversation(rivalPlayerAddress)
        .then((newConversation) => {
          setConversation(newConversation);
          setConversationStatus('Connected');
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
        // if (
        //   !messageContent
        // && messageContent.message === 'type'
        // ) {
        // setPlayerType(messageContent.data[currentPlayer!.id]);
        // } else {
        console.log('message', messageContent);
        setGameState(messageContent);

        // const decoded = defaultAbiCoder.decode(['uint8[9]', 'bool', 'bool'], messageContent);
        // console.log(decoded);

        // setBoardState([...messageContent]);
        // }
      }
      return stream;
    };

    streamMessages();
    return () => {
      if (!!stream) stream.return();
    };
  }, [conversation]);

  useEffect(() => {
    console.log('gameState useEffect', gameState);
  }, [gameState]);

  useEffect(() => {
    const newWinner = gameState[1] ? 0 : gameState[2] ? 1 : null;
    console.log('newWinner', newWinner);
    if (newWinner !== null) {
      setWinner(newWinner);
    }
  }, [gameState]);

  // console.log('address', address);
  console.log('conversationStatus', conversationStatus);
  if (!!gameType && gameType === 'tic-tac-toe') {
    return (
      <div className={styles.container}>
        <ControlPanel
          arbiterContractData={{
            abi: arbiterContract.abi as AbiItem[],
            address: arbiterContract.address,
          }}
          gameRulesContractData={{
            abi: rulesContract.abi as AbiItem[],
            address: rulesContract.address,
          }}
          playersTypes={{ 0: 'X', 1: 'O' }}
          onConnectPlayer={setConversationHandler}
          onSetPlayerIngameId={setPlayerIngameId}
          winner={winner}
          rivalPlayerConversationStatus={conversationStatus}
        />
        <TicTacToe
          gameState={gameState}
          playerType={playerType}
          playerIngameId={playerIngameId}
          onGameStateChange={gameStateChangeHandler}
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
