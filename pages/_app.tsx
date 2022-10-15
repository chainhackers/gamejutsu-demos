import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import { Layout } from 'components';
import { WalletContextProvider } from 'contexts/WalltetContext';
import { XmtpContextProvider } from 'contexts/XmtpContext';
import 'i18n/index';

import '@rainbow-me/rainbowkit/styles.css';
import 'styles/globals.css';
import XmtpProvider from "../contexts/XmtpProvider";

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.polygon,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
      : []),
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC',
    }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: 'GameJutsu App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/chainhackers/gamejutsu-subgraph',
  cache,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={client}>
        <WalletContextProvider>
          <XmtpContextProvider>
            <RainbowKitProvider chains={chains}>
              <XmtpProvider>
              <Layout>
                <Head>
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <Component {...pageProps} />
              </Layout>
              </XmtpProvider>
            </RainbowKitProvider>
          </XmtpContextProvider>
        </WalletContextProvider>
      </ApolloProvider>
    </WagmiConfig>
  );
}

export default MyApp;
