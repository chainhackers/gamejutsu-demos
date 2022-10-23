import { XMTPChatLogElement } from 'components/XMTPChatLog/XMTPChatLogElement';
import { XMTPChatLogPropsI } from './XMTPChatLogProps';
import styles from './XMTPChatLog.module.scss';
import React from "react";
import { IAnyMessage } from 'hooks/useConversation';

export const XMTPChatLog: React.FC<XMTPChatLogPropsI> = ({ anyMessages, isLoading }) => {
  let filteredMessages: IAnyMessage[] = [];
  for (const anyMessage of anyMessages) {
    if (anyMessage.messageType == "ISignedGameMove") {
      filteredMessages.push(anyMessage);
    }
  }

  console.log('anyMessages', anyMessages);
  console.log('filteredMessages', filteredMessages);

  function makeElements() {
    return filteredMessages.map((anyMessage: IAnyMessage) => {
      return <XMTPChatLogElement
       key={anyMessage.underlyingMessage.id} 
       anyMessage={anyMessage} 
       />
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>XMTPChatLog</div>
      <div className={styles.loader}>{`Status: ${filteredMessages.length === 0 ? 'Waiting...' : isLoading ? 'Fetching...' : 'Ready'
        }`}</div>
      <div className={styles.log}>
        {makeElements()}
      </div>
    </div>
  );
};
