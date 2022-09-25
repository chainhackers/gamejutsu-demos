import { XMTPChatLogElement } from 'components/XMTPChatLog/XMTPChatLogElement';
import { XMTPChatLogPropsI } from './XMTPChatLogProps';
import { defaultAbiCoder } from 'ethers/lib/utils';
import styles from './XMTPChatLog.module.scss';
import { decodeEncodedBoardState } from 'components/Games/ET-Tic-Tac-Toe/types';
export const XMTPChatLog: React.FC<XMTPChatLogPropsI> = ({ logData, isLoading }) => {
  let slicedLogData = logData.slice(0, 3);
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
    const id = message.id.slice(0, 17) + '...' + message.id.slice(-17);

    console.log('message', message);
    console.log('id:', message.id);
    console.log('sender: ', message.sender);
    console.log('recepient', message.recepient);
    console.log('timestamp', message.timestamp);
    console.log('signatures', signedGameMove.signatures);
    console.log(gameMove.move)
    console.log('gameMove', defaultAbiCoder.decode(['uint8'], gameMove.move));
    console.log('oldState', oldState);
    console.log('newState', newState);

    return {
      id: message.id.slice(0, 17) + '...' + message.id.slice(-17),
      sender: message.sender,
      recepient: message.recepient,
      timestamp: message.timestamp,
      signatures: signedGameMove.signatures,
      move: String(defaultAbiCoder.decode(['uint8'], gameMove.move)),
      oldState: JSON.stringify(oldState),
      newState: JSON.stringify(newState),
      content: message.content,
    };

    return {
      ...message,
      id,
      content: JSON.stringify({
        ...signedGameMove,
        gameMove: {
          ...gameMove,
          oldState,
          newState,
        },
      }),
    };
  });
  return (
    <div className={styles.container}>
      <div className={styles.title}>XMTPChatLog</div>
      <div className={styles.loader}>{`Satus: ${
        prettyLogData.length === 0 ? 'Waiting...' : isLoading ? 'Fetching...' : 'Ready'
      }`}</div>
      <div className={styles.log}>
        {prettyLogData.map((log) => (
          <XMTPChatLogElement key={log.id} {...log} />
        ))}
      </div>
    </div>
  );
};
