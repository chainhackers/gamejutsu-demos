import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Layout } from 'components';
import { WalletContextProvider } from 'contexts/WalltetContext';
import { XmtpContextProvider } from 'contexts/XmtpContext';
import 'i18n/index';
import '@rainbow-me/rainbowkit/styles.css';
import 'styles/globals.css';
import XmtpProvider from '../contexts/XmtpProvider';
// TODO: don't forget to bring back alchemy instead of publicProvider. @habdevs #190
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { GameStateContextProvider } from 'contexts/GameStateContext';

const { chains, provider, webSocketProvider } = configureChains(
  [polygon],
  // [publicProvider()],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }), publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'GameJutsu App',
  chains,
  projectId: 'efa8ae30b8b72991a9630a636d6d0411',
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

const version = 'v1.2.38';

function MyApp({ Component, pageProps }: AppProps) {
  const props = { ...pageProps, version };
  return (
    <WagmiConfig client={wagmiClient}>
      <GameStateContextProvider>
        <ApolloProvider client={client}>
          <WalletContextProvider>
            <XmtpContextProvider>
              <RainbowKitProvider chains={chains}>
                <XmtpProvider>
                  <Layout version={version}>
                    <Head>
                      <meta name='viewport' content='width=device-width, initial-scale=1' />
                    </Head>
                    <Component {...props} />
                  </Layout>
                </XmtpProvider>
              </RainbowKitProvider>
            </XmtpContextProvider>
          </WalletContextProvider>
        </ApolloProvider>
      </GameStateContextProvider>
    </WagmiConfig>
  );
}

export default MyApp;
