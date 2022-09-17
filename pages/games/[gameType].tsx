import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { TicTacToe } from 'components/Games';
import { XMTPChatLog } from 'components/XMTPChatLog';
import { ParsedUrlQuery } from 'querystring';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWalletContext } from 'context/WalltetContext';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ControlPanel } from 'components/ControlPanel';
import { AbiItem } from 'web3-utils';

import arbiterContract from 'contracts/Arbiter2.json';
import rulesContract from 'contracts/TicTacToeRules.json';

import styles from 'pages/games/gameType.module.scss';
interface IGamePageProps {
  gameType?: string;
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}

const Game: NextPage<IGamePageProps> = ({ gameType }) => {
  const account = useAccount();
  const connect = useConnect();
  const disconnect = useDisconnect();
  // console.log('account', account);
  // console.log('connect', connect);
  // console.log('disconnect', disconnect);
  // console.log('InjectedConnector', InjectedConnector);

  const { address } = useWalletContext();
  // console.log('address', address);
  if (!!gameType && gameType === 'tic-tac-toe') {
    return (
      <div className={styles.container}>
        <ControlPanel
          arbiterContractData={{
            abi: arbiterContract.abi as AbiItem[],
            address: arbiterContract.address,
          }}
          gameRulesContractData={{
            abi: rulesContract.abi as AbiItem[],
            address: rulesContract.address,
          }}
          playersTypes={{ 0: 'X', 1: 'O' }}
        />
        <TicTacToe />
        <XMTPChatLog logData={[]} isLoading={false} />
      </div>
    );
  }
  return <div>No Games Available</div>;
};

export const getStaticProps: GetStaticProps<IGamePageProps, IParams> = (context) => {
  console.log('context', context.params?.gameType);
  return {
    props: {
      gameType: context.params?.gameType,
    },
  };
};

export const getStaticPaths: GetStaticPaths<IParams> = () => {
  const gamesType = ['tic-tac-toe', 'other'];
  const paths = gamesType.map((gameType) => ({ params: { gameType } }));
  return {
    paths,
    fallback: false,
  };
};

export default Game;
