import { XMTPChatLogElement } from 'components/XMTPChatLog/XMTPChatLogElement';
import { XMTPChatLogPropsI } from './XMTPChatLogProps';
import styles from './XMTPChatLog.module.scss';
export const XMTPChatLog: React.FC<XMTPChatLogPropsI> = ({ logData, isLoading }) => {
  return (
    <div className={styles.container}>
      <h1>XMTPChatLog</h1>
      <div className={styles.loader}>{isLoading ? 'Fetching...' : 'Ready'}</div>
      {logData.slice(0, 5).map((log) => (
        <XMTPChatLogElement key={log.id} {...log} />
      ))}
    </div>
  );
};
