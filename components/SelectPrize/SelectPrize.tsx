import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { SelectPrizePropsI } from './SelectPrizeProps';
import styles from './SelectPrize.module.scss';
import { useState } from 'react';
import { Button } from 'components/shared';
export const SelectPrize: React.FC<SelectPrizePropsI> = () => {
  const [selected, setSelected] = useState<'free' | 'stake' | null>('free');
  const [disabled, setDisabled] = useState<('free' | 'stake')[]>([]);
  const [stakeValue, setStakeValue] = useState<string>('0.00');
  const { t } = useTranslation();
  const router = useRouter();
  console.log(router);
  const { query } = router;
  console.log(query);

  const selectPrizeHandler = (prize: 'free' | 'stake' | null) => {
    setSelected(prize);
    setStakeValue('0.00');
  };

  const playButtonClickHandler = () => {
    router.push(`/games/${query.gameType}`);
  };
  const returnButtonClickHandler = () => {
    router.push(`/games/${query.gameType}?join=true`);
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('selectPrize.title')}</div>
      <div className={styles.selected}>
        {selected === 'free' && (
          <div className={styles.free}>
            <div className={styles.freeDescription}>{t('selectPrize.description.free')}</div>
            <div className={styles.freePrize}>{t('selectPrize.prize.free')}</div>
          </div>
        )}
        {selected === 'stake' && (
          <div className={styles.stake}>
            <div className={styles.stakeValue}>
              <span>{stakeValue}</span>{' '}
              <span className={styles.currency}>{t('selectPrize.prize.stake')}</span>
            </div>
            <div className={styles.stakes}>
              <div onClick={() => setStakeValue('5.00')} className={styles.stakeButton}>
                5.00
              </div>
              <div onClick={() => setStakeValue('10.00')} className={styles.stakeButton}>
                10.00
              </div>
            </div>
            <div className={styles.notification}>{`${t(
              'selectPrize.notification.p1',
            )} 5.00 ${t('selectPrize.prize.stake')}, ${t(
              'selectPrize.notification.p2',
            )} 10.00 ${t('selectPrize.prize.stake')}`}</div>
          </div>
        )}
      </div>
      <div className={styles.selection}>
        <div
          onClick={() => selectPrizeHandler('free')}
          className={cn(
            styles.free,
            selected === 'free' ? styles.selected : null,
            disabled.includes('free') ? styles.disabled : null,
          )}
        >
          <div className={styles.title}>{t('selectPrize.free.title')}</div>
          <div className={styles.description}>{t('selectPrize.free.description')}</div>
          <div className={styles.image}>
            <svg
              width="124"
              height="119"
              viewBox="0 0 124 119"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M89.7186 5H32.7186C28.3187 5 26.2186 8.66667 25.7185 10.5L7.71863 64.5C5.21854 71 4.21826 73 8.21863 76.5L56.7186 111.5C61.1186 115.9 66.2186 113.333 68.2186 111.5C83.7186 100 115.219 76.5 117.219 74.5C119.219 72.5 118.385 67.6667 117.719 65.5L100.219 10.5C99.4186 6.1 92.8853 5 89.7186 5Z"
                // stroke="#828282"
                strokeWidth="10"
              />
            </svg>
          </div>
        </div>
        <div
          onClick={() => selectPrizeHandler('stake')}
          className={cn(
            styles.stake,
            selected === 'stake' ? styles.selected : null,
            disabled.includes('stake') ? styles.disabled : null,
          )}
        >
          <div className={styles.title}>{t('selectPrize.stake.title')}</div>
          <div className={styles.description}>{t('selectPrize.stake.description')}</div>
          <div className={styles.image}>
            <svg
              width="127"
              height="127"
              viewBox="0 0 127 127"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="63.5" cy="63.5" r="58.5" strokeWidth="10" />
            </svg>
          </div>
        </div>
      </div>
      <div className={styles.play}>
        <Button
          title={t('buttons.play')}
          color="black"
          borderless
          onClick={playButtonClickHandler}
        />
      </div>
      <div className={styles.return}>
        <Button title={t('buttons.return')} borderless onClick={returnButtonClickHandler} />
      </div>
    </div>
  );
};
