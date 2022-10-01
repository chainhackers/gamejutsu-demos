import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { GameField, GameThumbnail } from 'components';
import { useAccount } from 'wagmi';
import { GameFieldPropsI } from 'components/GameField/GameFieldProps';
import { FinishedGameState } from 'gameApi';

const TestsPage: NextPage = () => {

  let finishedGameState = new FinishedGameState(
    158,
    '0xWinnerAddress',
    '0xLoserAddress',
    false,
    '0xResignedAddress',
    '0XDisqualifiedAddres'
  )

  let props:GameFieldPropsI = {
    gameId: '158',
    rivalPlayerAddress: '0xOpponentAddress',
    isConnected: false,
    isInDispute: false,
    finishedGameState,
    onConnect: async (opponent) => {}
  }

  return (
      <GameField
        {...props}
      >
      </GameField>
  );
};

export default TestsPage;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
    },
  };
};
