import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from 'components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import styles from './Connect.module.scss';
const ConnectPage = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { t } = useTranslation();
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    setIsConnected(!!address);
  });

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('connectPage.title')}</div>
      <div className={styles.description}>{t('connectPage.description')}</div>
      <div className={styles.wallets}>{t('connectPage.wallets')}</div>
      <div className={styles.connectButton}>
        <ConnectButton />
      </div>
      {isConnected && (
        <div>
          <Button
            title={t('buttons.play')}
            color="black"
            borderless
            onClick={() => router.push(`/v2/games`)}
          />
        </div>
      )}
    </div>
  );
};

export default ConnectPage;
