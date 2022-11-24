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
  const [legend, setLegend] = useState<'finish' | 'init' | 'resolve' | null>(null);
  const { t } = useTranslation();

  const closeLegendHandler: React.MouseEventHandler<HTMLDivElement> = () => {
    setLegend(null);
  }
  const showLegendHandler = (type: 'finish' | 'init' | 'resolve'): React.MouseEventHandler<HTMLDivElement> => (event) => {
    event.stopPropagation();
    setLegend(type);

  }

  const legendButtonsMap: {
    'finish': { disabled: boolean, cb: () => Promise<void> };
    'init': { disabled: boolean, cb: () => Promise<void> };
    'resolve': { disabled: boolean, cb: () => Promise<void> };
  } = {
    'finish': { disabled: !isFinishTimeOutAllowed, cb: finishTimeout },
    'init': { disabled: !isTimeoutAllowed, cb: initTimeout },
    'resolve': {disabled: !isResolveTimeoutAllowed, cb: resolveTimeout},
  }

  return (
    <div className={styles.container}>
      <Player {...player1} />
      <div className={styles.controls}>
        {<div className={cn(styles.legend, legend ? styles.show : null)}>
          <div className={styles.close} onClick={closeLegendHandler}></div>
          <span className={styles.text}>{t(`players.legend.${legend}`)}</span>
          <Button
            size="sm"
            color="black"
            borderless
            title={t(`players.timeoutButtons.${legend}`)}
            disabled={!!legend ? legendButtonsMap[legend].disabled: false}
            onClick={!!legend ? legendButtonsMap[legend].cb: undefined}
          />
        </div>}
        <div 
          onClick={isTimeoutAllowed ? initTimeout: undefined} 
          className={cn(styles.popup_button, !isTimeoutAllowed ? styles.disabled : null)}>
          {t('players.timeoutButtons.init')}
          <span className={styles.hint} onClick={showLegendHandler('init')}>?</span>
        </div>
        <div 
          onClick={isResolveTimeoutAllowed ? resolveTimeout: undefined} 
          className={cn(styles.popup_button, !isResolveTimeoutAllowed ? styles.disabled : null)}>
          {t('players.timeoutButtons.resolve')}
          <span className={styles.hint} onClick={showLegendHandler('resolve')}>?</span>
        </div>
        <div 
          onClick={isFinishTimeOutAllowed ? finishTimeout: undefined} 
          className={cn(styles.popup_button, !isFinishTimeOutAllowed ? styles.disabled : null)}>
          {t('players.timeoutButtons.finish')}
          <span className={styles.hint} onClick={showLegendHandler('finish')}>?</span>
        </div>
        <div className={cn(styles.timeout, isTimeoutRequested ? styles.show: null)}>
          {isTimeoutRequested && t('players.timeout')}
        </div>
      </div> 
        <Player {...player2} />
    </div>
  );
};
