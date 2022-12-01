import { useEffect, useState } from 'react';
import { IChatLogMessage } from 'types/chat';
// import { IChatLogMessage } from 'types';
import {
  addDataWithCustomId,
  db,
  getDocumentById,
  subcribeListeningByDocumentId,
  updateDocumentArrayDataByField,
} from 'utils/firebase';

// export interface IChatLogMessage {
//   gameId: string;
//   messageType: 'ISignedGameMove' | string;
//   gameType: string;
//   nonce: number;
//   senderAddress: string;
//   recipientAddress: string;
//   sent: number;
//   message: {
//     signatures: string[];
//     gameMove: {
//       gameId: number;
//       nonce: number;
//       player: string;
//       oldState: any;
//       newState: any;
//       move: string;
//     };
//   };
// }

const useFirebaseConversation = (
  // peerAddress: string,
  gameId: number,
  // stopOnFirstMove: boolean,
) => {
  // const [gameId, setGameId] = useState<number | null>(null);
  const [lastFirebaseMessages, setLastMessages] = useState<IChatLogMessage[]>([]);
  // const [conversation, setConversation] = useState<Conversation | null>(null);
  // const [loading] = useState<boolean>(false);
  const [collectedFirebaseMessages, setCollectedMessages] = useState<{
    moves: IChatLogMessage[];
  } | null>(null);
  // const [lastMessages, setLastMessages] = useState<IAnyMessage[]>([]);

  // useEffect(() => {
  //   const getConvo = async () => {
  //     if (!client || !peerAddress) {
  //       return;
  //     }
  //     setConversation(await client.conversations.newConversation(peerAddress));
  //   };
  //   getConvo();
  // }, [client, peerAddress]);

  // useEffect(() => {
  //   if (!conversation) {
  //     return;
  //   }

  //   function setMessageStates(messages: IAnyMessage[]) {
  //     if (messages.length) {
  //       setCollectedMessages((prevValue) => [...messages, ...prevValue]);
  //       setLastMessages(messages); //TODO
  //     }
  //   }

  //   const streamMessages = async () => {
  //     stream = await conversation.streamMessages();
  //     for await (const message of stream) {
  //       const { messages } = filterMessages(gameId, [message]);
  //       setMessageStates(messages);
  //     }
  //   };

  //   getMessageHistory(conversation, gameId, stopOnFirstMove)
  //     .then(({ messages }) => {
  //       setMessageStates(messages);
  //     })
  //     .then(
  //       // we can lose some useless messages here
  //       () => streamMessages(),
  //     );

  //   return () => {
  //     const closeStream = async () => {
  //       if (!stream) return;
  //       await stream.return();
  //     };
  //     closeStream();
  //   };
  // }, [conversation]);

  const sendFirebaseMessage = async (data: any) => {
    console.log('last called message');
    // if (!!gameId)
      updateDocumentArrayDataByField(db, 'testchats', data, String(gameId), 'moves');
  };

  const collectFirebaseMessages = async () => {
    if (!!gameId) await getDocumentById(db, 'testchats', String(gameId));
  };

  // const init = (gameId: string) => {
  //   setGameId(gameId);
  // };

  useEffect(() => {
    if (collectedFirebaseMessages?.moves && collectedFirebaseMessages?.moves.length > 0) {
      setLastMessages(collectedFirebaseMessages.moves);
    }
  }, [collectedFirebaseMessages]);

  useEffect(() => {
    if (!!gameId) {
      const unsubscribe = subcribeListeningByDocumentId(
        db,
        'testchats',
        setCollectedMessages,
        String(gameId),
      );
      return unsubscribe;
    }
  }, [gameId]);

  return {
    // loading,
    sendFirebaseMessage,
    collectedFirebaseMessages,
    lastFirebaseMessages,
    // init,
    // client,
  };
};

export default useFirebaseConversation;
