import { IChatLogProps } from './ChatLogProps';
import styles from './ChatLog.module.scss';
import { IAnyMessage, IChatLogMessage } from 'types/chat';
import { ChatLogElement } from './ChatLogElement';

export const ChatLog: React.FC<IChatLogProps> = ({ anyMessages, isLoading }) => {
  const filteredMessages: IChatLogMessage[] = [];
  if (!!anyMessages) {
    const { moves } = anyMessages;
    if (!!moves) {
      for (const anyMessage of moves) {
        if (anyMessage.messageType == 'ISignedGameMove') {
          filteredMessages.push(anyMessage);
        }
      }
    }
  }

  function makeElements() {
    return filteredMessages
      .sort((a, b) => {
        return b.message.gameMove.nonce - a.message.gameMove.nonce;
      })
      .map((anyMessage: IChatLogMessage, index) => {
        return <ChatLogElement key={anyMessage.gameId + index} anyMessage={anyMessage} />;
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>ChatLog</div>
      <div className={styles.loader}>{`Status: ${
        filteredMessages.length === 0 ? 'Waiting...' : isLoading ? 'Fetching...' : 'Ready'
      }`}</div>
      <div className={styles.log}>{makeElements()}</div>
    </div>
  );
};
