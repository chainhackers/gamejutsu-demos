import { FinishedGameState } from 'gameApi';
import { useEffect, useState } from 'react';
import { IChatLogMessage, IFinishgameMessage } from 'types/chat';
import {
  db,
  subcribeListeningByDocumentId,
  updateDocumentArrayDataByField,
} from 'utils/firebase';


const useFirebaseConversation = (
  gameId: number,

) => {
  const [lastFirebaseMessages, setLastMessages] = useState<
    IChatLogMessage[] | IFinishgameMessage[]
  >([]);

  const [collectedFirebaseMessages, setCollectedMessages] = useState<{
    moves: IChatLogMessage[];
  } | null>(null);


  const sendFirebaseMessage = async (data: any) => {
    updateDocumentArrayDataByField(db, 'testchats', data, String(gameId), 'moves');
  };


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
    sendFirebaseMessage,
    collectedFirebaseMessages,
    lastFirebaseMessages,
  };
};

export default useFirebaseConversation;
