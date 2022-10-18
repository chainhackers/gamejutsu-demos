import { useState, useCallback, useEffect } from 'react';
import { useXmptContext } from '../../contexts/XmtpContext';
import { Conversation, Message, Stream } from '@xmtp/xmtp-js';

const ChatPage = () => {
  const [addressInputValue, setAddressInputValue] = useState<string>('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [incommingMessages, setIncomingMessages] = useState<any[]>([]);

  const { client } = useXmptContext();
  const checkIfOnNetwork = useCallback(
    async (address: string): Promise<boolean> => {
      return client?.canMessage(address) || false;
    },
    [client],
  );

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const isInNetwork = !!addressInputValue
      ? await checkIfOnNetwork(addressInputValue)
      : false;

    if (!!isInNetwork && !!addressInputValue) {
      const newConversation = await client?.conversations.newConversation(addressInputValue)!;
      if (!newConversation) {
        console.error('no conversation');
        return;
      }
      setConversation(newConversation);
    }
  };

  const sendMessageHandler = () => {
    const messageText = String(`Time stamp: ${Date.now()}`);
    if (!conversation) {
      console.warn('no conversation!');
      return;
    }
    conversation
      .send(messageText)
      .then((data) => {
        console.log('send message data', data.id, data.content);
      })
      .catch((error) => {
        console.error('send message error', error);
      });
  };

  useEffect(() => {
    if (!conversation) {
      console.log('no conversation');
      return;
    }

    const streamMessages = async () => {
      const stream = await conversation.streamMessages();
      for await (const msg of stream) {
        setIncomingMessages([...incommingMessages, msg]);
      }
    };

    streamMessages();
  }, [conversation]);

  useEffect(() => {
    setMessages([...incommingMessages, ...messages]);
  }, [incommingMessages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation) {
        console.warn('no conversation');
        return;
      }
      const opts = {
        // startTime: new Date(new Date().setDate(new Date().getDate() - 1)), //TODO filtering breaks things, research some more
        // endTime: new Date(),
      }
      const msgs = await conversation.messages(opts);
      setMessages(msgs.sort((msg1, msg2) => msg2.sent!.getTime() - msg1.sent!.getTime()));
    };

    fetchMessages();
  }, [conversation]);

  return (
    <div>
      Chat
      <div>
        {/* 0xDb0b11d1281da49e950f89bD0F6B47D464d25F91 */}
        <form onSubmit={submitHandler}>
          <label>Address to chat with: </label>
          <input
            value={addressInputValue}
            onChange={(event) => setAddressInputValue(event.target.value)}
          ></input>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        Conversation
        {conversation ? (
          <div>
            Has converstaion
            <div>
              <button onClick={sendMessageHandler}>Send Message</button>
              <div style={{ display: 'flex' }}>
                <div style={{ padding: '5px' }}>
                  Messages:{' '}
                  {messages.map(({ id, senderAddress, recipientAddress, content, sent }) => (
                    <div key={id} style={{ paddingBottom: '5px' }}>
                      <div>Id: {id}</div>
                      <div>Sender: {senderAddress}</div>
                      <div>Recepient: {recipientAddress}</div>
                      <div>Content: {content}</div>
                      <div>Time sent: {sent?.toISOString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>No conversation</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
