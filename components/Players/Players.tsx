import { useTranslation } from 'react-i18next';
import cn from 'classnames'
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
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Player {...player1} />
      <div className={styles.controls}>
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
        <div className={cn(styles.timeout, isTimeoutRequested ? styles.show: null)}>
          {isTimeoutRequested && t('players.timeout')}
        </div>
      </div> 
        <Player {...player2} />
    </div>
  );
};
