import { XMTPChatLogElement } from 'components/XMTPChatLog/XMTPChatLogElement';
import { XMTPChatLogPropsI } from './XMTPChatLogProps';
import styles from './XMTPChatLog.module.scss';
import { decodeEncodedBoardState } from 'components/Games/ET-Tic-Tac-Toe/types';
export const XMTPChatLog: React.FC<XMTPChatLogPropsI> = ({ logData, isLoading }) => {
  let slicedLogData = logData.slice(0, 5);
  let prettyLogData = slicedLogData.map((message) => {
    let signedGameMove = message.content && JSON.parse(message.content);
    let gameMove = signedGameMove?.gameMove;
    let _oldState = gameMove?.oldState;
    let _newState = gameMove?.newState;
    if (!_oldState || !_newState) {
      return message;
    }
    let oldState = decodeEncodedBoardState(_oldState);
    let newState = decodeEncodedBoardState(_newState);
    return {
      ...message,
      content: JSON.stringify({
        ...signedGameMove,
        gameMove: {
          ...gameMove,
          oldState,
          newState
        }
      })
    }
  });
  return (
    <div className={styles.container}>
      <h1>XMTPChatLog</h1>
      <div className={styles.loader}>{isLoading ? 'Fetching...' : 'Ready'}</div>
      {prettyLogData.map((log) => (
        <XMTPChatLogElement key={log.id} {...log} />
      ))}
    </div>
  );
};
