import { XMTPChatLogElementPropsI } from './XMTPChatLogElementProps';
import styles from './XMTPChatLogElement.module.scss';
export const XMTPChatLogElement: React.FC<XMTPChatLogElementPropsI> = ({
  id,
  sender,
  recepient,
  timestamp,
  signatures,
  move,
  oldState,
  newState,
}) => {
  const date = new Date(timestamp);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.title}>Id:</div>
        <div className={styles.data}>{id}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Sender:</div>
        <div className={styles.data}>{sender}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Recepient:</div>
        <div className={styles.data}>{recepient}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Date:</div>
        <div className={styles.data}>{date.toISOString()}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Move:</div>
        <div className={styles.data}>{move}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Old state:</div>
        <div className={styles.data}>{oldState}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>New state:</div>
        <div className={styles.data}>{newState}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Signatures:</div>
        <div className={styles.data}>{signatures}</div>
      </div>
    </div>
  );
};
