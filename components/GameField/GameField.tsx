import { useTranslation } from 'react-i18next';
import { GameFieldPropsI } from './GameFieldProps';
import styles from './GameField.module.scss';
import { Button } from 'components/shared';
export const GameField: React.FC<GameFieldPropsI> = ({ children }) => {
  const { t } = useTranslation();
  const appealedPlayer = 'Player 1';
  const winner = 'Player 1';
  return (
    <div className={styles.container}>
      {false && (
        <div className={styles.shade}>
          {false && <div className={styles.wait}>{t('shade.wait')}</div>}
          {false && (
            <div className={styles.report}>
              <div className={styles.whatToReport}>{t('shade.whatToReport')}</div>
              <div className={styles.buttons}>
                <Button title={t('shade.cheating')} color="black" borderless />
                <Button title={t('shade.inactive')} />
              </div>
            </div>
          )}
          {false && (
            <div className={styles.appeal}>
              <div className={styles.madeAppeal}>{`${appealedPlayer}${t(
                'shade.madeAppeal',
              )}`}</div>
              <div className={styles.notice}>{t('shade.notice')}</div>
            </div>
          )}
          {false && <div className={styles.win}>{`${winner}${t('shade.win')}`}</div>}
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.room}>Room 1</div>
        <div className={styles.message}>
          Alice please make your first move by clicking on any one of the boxes
        </div>
        <div className={styles.prize}>Prize</div>
      </div>
      <div className={styles.gameBoardContainer}>{children}</div>
    </div>
  );
};
