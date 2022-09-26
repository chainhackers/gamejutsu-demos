import { useTranslation } from 'react-i18next';
import { GameFieldPropsI } from './GameFieldProps';
import styles from './GameField.module.scss';
import { Button } from 'components/shared';
import { useEffect, useState } from 'react';
export const GameField: React.FC<GameFieldPropsI> = ({
  children,
  gameId,
  rivalPlayerAddress,
  isConnected,
  isInDispute,
  winner,
  disputeAppealPlayer,
  onConnect,
}) => {
  const [isShowShade, setShowShade] = useState<boolean>(true);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isShowReport, setShowReport] = useState<boolean>(false);
  const [isShowDispute, setShowDispute] = useState<boolean>(false);
  const [isWinner, setWinner] = useState<string | null>();
  const { t } = useTranslation();
  const appealedPlayer = 'Player 1';
  // const winner = 'Player 1';
  useEffect(() => {
    console.log('isConnected gameField', isConnected);
    if (!rivalPlayerAddress) {
      setShowShade(true);
      setIsWaiting(true);
    }
    if (!!rivalPlayerAddress) {
      setIsWaiting(false);
      setIsConnecting(true);
      // return;
    }
    if (isConnected) {
      console.log('isConnected gameField', isConnected);
      setIsConnecting(false);
      setIsWaiting(false);
      setShowShade(false);
      // return;
    }
  }, [rivalPlayerAddress, isConnected]);

  useEffect(() => {
    if (isInDispute) {
      setShowShade(true);
      setIsWaiting(false);
      setIsConnecting(false);
      setWinner(null);
      setShowDispute(true);
    }
  }, [isInDispute]);

  useEffect(() => {
    if (!!winner) {
      setShowShade(true);
      setIsWaiting(false);
      setIsConnecting(false);
      setShowDispute(false);
      setWinner(winner);
    }
  }, [winner]);
  return (
    <div className={styles.container}>
      {isShowShade && (
        <div className={styles.shade}>
          {isWaiting && <div className={styles.wait}>{t('shade.wait')}</div>}
          {isConnecting && (
            <div className={styles.wait}>
              {t('shade.connecting')}
              <div className={styles.connectButton}>
                <Button
                  borderless
                  size="sm"
                  title={t('buttons.connect')}
                  onClick={() => {onConnect(rivalPlayerAddress!)}}
                />
              </div>
            </div>
          )}
          {isShowReport && (
            <div className={styles.report}>
              <div className={styles.whatToReport}>{t('shade.whatToReport')}</div>
              <div className={styles.buttons}>
                <Button title={t('shade.cheating')} color="black" borderless />
                <Button title={t('shade.inactive')} />
              </div>
            </div>
          )}
          {isShowDispute && (
            <div className={styles.appeal}>
              <div className={styles.madeAppeal}>{`${disputeAppealPlayer} ${t(
                'shade.madeAppeal',
              )}`}</div>
              <div className={styles.notice}>{t('shade.notice')}</div>
            </div>
          )}
          {isWinner && (
            <div className={styles.win}>
              {isWinner === 'Draw!' ? isWinner : `${isWinner} ${t('wins')}`}
            </div>
          )}
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.room}>Game Id: {gameId ? gameId : 'n/a'}</div>
        <div className={styles.message}>
          Alice please make your first move by clicking on any one of the boxes
        </div>
        <div className={styles.prize}>Prize</div>
      </div>
      <div className={styles.gameBoardContainer}>{children}</div>
    </div>
  );
};
