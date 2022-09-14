import { XMTPChatLogElementPropsI } from './XMTPChatLogElementProps';
import styles from './XMTPChatLogElement.module.scss';
export const XMTPChatLogElement: React.FC<XMTPChatLogElementPropsI> = ({
  id,
  sender,
  recepient,
  content,
  timestamp,
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
        <div className={styles.title}>Content:</div>
        <div className={styles.data}>{content}</div>
      </div>
    </div>
  );
};
