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
import { useWalletContext } from './WalltetContext';
import { getEnv } from '../helpers';

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
  conversations: Map<string, Conversation> | null;
  loadingConversations: boolean;
  initClient: (wallet: Signer) => void;
};

export const XmtpContext = createContext<XmtpContextType>(xmtpContextDefault);

export const useXmptContext = () => useContext(XmtpContext);

export const XmtpContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client | null>();
  const { signer } = useWalletContext();
  const [loadingConversations, setLoadingConversations] = useState<boolean>(false);

  const [conversations, dispatchConversations] = useReducer(
    (
      state: Map<string, Conversation>,
      newConvos: Conversation[] | undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any => {
      if (newConvos === undefined) {
        return null;
      }
      newConvos.forEach((convo) => {
        if (convo.peerAddress !== client?.address) {
          if (state && !state.has(convo.peerAddress)) {
            state.set(convo.peerAddress, convo);
          } else if (state === null) {
            state = new Map();
            state.set(convo.peerAddress, convo);
          }
        }
      });
      return state ?? null;
    },
    [],
  );

  const initClient = useCallback(async (wallet: Signer) => {
    if (wallet) {
      try {
        setClient(await Client.create(wallet, { env: getEnv() }));
      } catch (e) {
        console.error(e);
        setClient(null);
      }
    }
  }, []);

  const disconnect = () => {
    setClient(undefined);
    dispatchConversations(undefined);
  };

  useEffect(() => {
    signer ? initClient(signer) : disconnect();
  }, [initClient, signer]);

  useEffect(() => {
    if (!client) return;

    const listConversations = async () => {
      console.log('Listing conversations');
      setLoadingConversations(true);
      const convos = await client.conversations.list();
      convos.forEach((convo: Conversation) => {
        dispatchConversations([convo]);
      });
      setLoadingConversations(false);
    };
    listConversations();
  }, [client]);

  const [providerState, setProviderState] = useState<XmtpContextType>({
    client,
    conversations,
    loadingConversations,
    initClient,
  });

  useEffect(() => {
    setProviderState({
      client,
      conversations,
      loadingConversations,
      initClient,
    });
  }, [client, conversations, initClient, loadingConversations]);

  return <XmtpContext.Provider value={providerState}>{children}</XmtpContext.Provider>;
};
