import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

import styles from 'pages/v2/results/results.module.scss';
import { Result } from 'components/v2/GameResults/Result/Result';
import { Tip } from 'components/v2/GameResults/Tip';
import { About } from 'components/v2/GameResults/About';

const GamesPage: NextPage = ({}) => {
  const { t } = useTranslation();
  const { address } = useAccount();

  return (
    <div className={styles.container}>
      <Result />
      <Tip />
      <About />
    </div>
  );
};

export default GamesPage;
