import { useSSR, useTranslation } from 'react-i18next';
import { Button, Player } from 'components';
import { PlayersPropsI } from './PlayersProps';
import styles from './Players.module.scss';
import { useState } from 'react';

export const Players: React.FC<PlayersPropsI> = ({
  player1,
  player2,
  isTimeoutAllowed,
  initTimeout,
  isResolveTimeoutAllowed,
  resolveTimeout,
  isFinishTimeOutAllowed,
  finishTimeout,
  isTimeoutRequested,
  // connectPlayer,
}) => {
  const [isTimeoutInit, setIsTimeoutInit] = useState<boolean>(false);
  const [isConnectionAllowed, setIsConnectionAllower] = useState<boolean>(false);

  const { t } = useTranslation();
  console.log('isTimeOutAllowed', isTimeoutAllowed);
  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('players.title')}</div>
      <div>
        <div>
          <Player {...player1} />
          <Button
            size="sm"
            color="black"
            borderless
            title="Init timeout"
            disabled={!isTimeoutAllowed}
            onClick={initTimeout}
          />
          <Button
            size="sm"
            color="black"
            borderless
            title="Resolve timeout"
            disabled={!isResolveTimeoutAllowed}
            onClick={resolveTimeout}
          />
          <Button
            size="sm"
            color="black"
            borderless
            title="Finish timeout"
            disabled={!isFinishTimeOutAllowed}
            onClick={finishTimeout}
          />
        </div>

        <div className={styles.timeout}>
          {isTimeoutRequested && 'Another player reqeusted timeout!'}
        </div>

        <Player {...player2} />
      </div>
    </div>
  );
};
