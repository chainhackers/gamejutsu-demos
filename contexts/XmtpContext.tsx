import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import { Client, Message } from '@xmtp/xmtp-js';
import { Conversation } from '@xmtp/xmtp-js';
import { Signer } from 'ethers';

const xmtpContextDefault = {
  client: undefined,
  conversations: null,
  loadingConversations: false,
  initClient: () => undefined,
};

export type MessageStoreEvent = {
  peerAddress: string;
  messages: Message[];
};

export type XmtpContextType = {
  client: Client | undefined | null;
  loadingConversations: boolean;
  initClient: (wallet: Signer) => void;
};

export const XmtpContext = createContext<XmtpContextType>(xmtpContextDefault);

export const useXmptContext = () => useContext(XmtpContext);

export const XmtpContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client | null>();

  const [loadingConversations, setLoadingConversations] = useState<boolean>(false);

  const initClient = useCallback(async (wallet: Signer) => {
    if (wallet) {
      try {
        //buildDirectMessageTopic;
        let _client = await Client.create(wallet, { env: 'production' });
        _client.init //streamConversationMessages
        setClient(_client);
      } catch (e) {
        console.error(e);
        setClient(null);
      }
    }
  }, []);

  const disconnect = () => {
    setClient(undefined);
  };

  const [providerState, setProviderState] = useState<XmtpContextType>({
    client,
    loadingConversations,
    initClient,
  });

  useEffect(() => {
    setProviderState({
      client,
      loadingConversations,
      initClient,
    });
  }, [client, initClient, loadingConversations]);

  return <XmtpContext.Provider value={providerState}>{children}</XmtpContext.Provider>;
};
