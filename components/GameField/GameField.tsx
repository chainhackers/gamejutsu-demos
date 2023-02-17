import { useTranslation } from 'react-i18next';
import { GameFieldPropsI } from './GameFieldProps';
import { useQuery } from '@apollo/client';
import { badgesQuery } from 'queries';
import styles from './GameField.module.scss';
import { Button } from 'components/shared';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { FinishedGameState } from 'gameApi';
export const GameField: React.FC<GameFieldPropsI> = ({
  children,
  rivalPlayerAddress,
  isConnected,
  disputeMode,
  finishedGameState,
  onConnect,
  players,
  finishGameCheckResult,
  onClaimWin,
  version,
  isInvalidMove,
  onRunDisput,
}) => {
  const [isShowShade, setShowShade] = useState<boolean>(true);
  const [isShowExplainMove, SetShowExplainMove] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isShowReport, setShowReport] = useState<boolean>(false);
  const [isShowDispute, setShowDispute] = useState<boolean>(false);

  type TMedal = 'bronze' | 'silver' | 'gold';
  type TBelt = 'white' | 'green' | 'black';
  type TAchievement = 'winner' | 'loser' | 'draw' | 'cheater';

  const { t } = useTranslation();
  const account = useAccount();

  const { data, error, loading } = useQuery(badgesQuery, {
    variables: { id: account.address?.toLowerCase() },
  });

  console.log('dispute mode', disputeMode, account.address)

  function isOpponentAddress(address: string): boolean {
    return address === rivalPlayerAddress;
  }

  function isCurrentPlayerAddress(address: string | null): boolean {
    return !!address && !isOpponentAddress(address);
  }

  function makeFinishedGameReasonDescription(finishedGameState: FinishedGameState): string | undefined {
    if (finishedGameState.disqualified) {
      if (isOpponentAddress(finishedGameState.disqualified)) {
        return 'and opponent was disqualified'
      } else {
        return 'because you were disqualified'
      }
    }
    if (finishedGameState.resigned) {
      if (isOpponentAddress(finishedGameState.resigned)) {
        return 'by resignation'
      } else {
        return 'by resignation'
      }
    }
  }

  function makeFinishedGameDescription(finishedGameState: FinishedGameState): string | undefined {
    if (finishedGameState.isDraw) {
      return 'Game end in a draw'
    }
    if (finishedGameState.winner) {
      if (isOpponentAddress(finishedGameState.winner)) {
        return 'Your opponent wins'
      }
      else {
        return 'You win'
      }
    }
  }

  useEffect(() => {
    if (!rivalPlayerAddress) {
      setShowShade(true);
      setIsWaiting(true);
      return;
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
    if (disputeMode.isInDispute) {
      setShowShade(true);
      setIsWaiting(false);
      setIsConnecting(false);
      setShowDispute(true);
    }
  }, [disputeMode.isInDispute]);

  useEffect(() => {
    if (!!finishedGameState) {
      setShowShade(true);
      setIsWaiting(false);
      setIsConnecting(false);
      setShowDispute(false);
    }
  }, [finishedGameState]);

  useEffect(() => {
    if (!!finishGameCheckResult) {
      setShowShade(true);
      setIsWaiting(false);
      setIsConnecting(false);
      setShowDispute(false);
    }
  })

  const isBadgeAvailable = (data: any, medal: TMedal, achievement: TAchievement): boolean => {
    let entity = data && data.inRowCounterEntities[0];
    if (!entity) {
      return false;
    }
    let maxValue = entity[`${achievement}MaxValue`];
    if (medal == 'bronze') return maxValue >= 1;
    if (medal == 'silver') return maxValue >= 5;
    if (medal == 'gold') return maxValue >= 10;
    return false;
  }

  function countToMedal(count: number, maxValue: number): TMedal | undefined {
    //TODO need guarantee that graph is old. The same for other badges
    if ((count == 9) && (maxValue == 9)) return 'gold';
    if ((count == 4) && (maxValue == 4)) return 'silver';
    if ((count == 0) && (maxValue == 0)) return 'bronze';
  }

  const isJustObtainedBadge = (data: any, medal: TMedal, achievement: TAchievement): boolean => {
    let entity = data && data.inRowCounterEntities[0];
    if (!entity || !finishedGameState) {
      return false;
    }
    let maxValue = entity[`${achievement}MaxValue`];
    let count = entity[`${achievement}Count`];
    if (countToMedal(count, maxValue) !== medal) {
      return false;
    }
    if (achievement == 'draw') {
      return finishedGameState.isDraw;
    }
    if (isCurrentPlayerAddress(finishedGameState.winner)) {
      return achievement == 'winner'
    }
    if (isCurrentPlayerAddress(finishedGameState.loser)) {
      return achievement == 'loser'
    }
    if (isCurrentPlayerAddress(finishedGameState.disqualified)) {
      return achievement == 'cheater'
    }
    return false;
  }

  const makeBadge = (medal: TMedal, achievement: TAchievement) => {
    const generateLink = (medal: TMedal, achievement: TAchievement) => {
      return `https://playground.sismo.io/gamejutsu-${medal}-${achievement}`;
    };
    const getBeltFromMedal = (medal: TMedal): TBelt | undefined => {
      if (medal == 'bronze') return 'white';
      if (medal == 'silver') return 'green';
      if (medal == 'gold') return 'black';
    };
    const generateFilename = (medal: TMedal, achievement: TAchievement) => {
      return `/badges/gamejutsu_${achievement}_${getBeltFromMedal(medal)}.svg`;
    };

    return <Link key={`${achievement}-${medal}`} target="_blank" href={generateLink(medal, achievement)}>
      <a>
        <div
          className={cn(
            styles.badge,
            isBadgeAvailable(data, medal, achievement) ? styles.available : null,
            isJustObtainedBadge(data, medal, achievement) ? styles.obtained : null,
          )}
        >
          <img
            src={generateFilename(medal, achievement)}
          ></img>
        </div>
      </a>
    </Link>
  }
  const makeBadges = () => {
    let badges = [];
    for (let achievement of ['winner', 'loser', 'draw', 'cheater'] as TAchievement[]) {
      for (let medal of ['bronze', 'silver', 'gold'] as TMedal[]) {
        badges.push(makeBadge(medal, achievement));
      }
    }
    return (<div className={styles.row}>
      {badges}
    </div>);
  }

  return (
    <div className={styles.container}>
      {version && <div className={styles.version}>{`Ver.${version}`}</div>}
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
                  onClick={() => {
                    onConnect(rivalPlayerAddress!);
                  }}
                />
              </div>
            </div>
          )}
          {isShowExplainMove && (
            <div className={styles.wait}>
              {t('shade.connecting')}
              <div className={styles.moveButtonbb}>
                <Button
                  borderless
                  color='black'
                  size="sm"
                  title="No jump. I move"
                  onClick={() => {
                    onConnect(rivalPlayerAddress!);
                  }}
                />
              </div>
              <div className={styles.moveButtonbr}>
                <Button
                  borderless
                  color='black'
                  size="sm"
                  title="No jump. Let opponent move"
                  onClick={() => {
                    onConnect(rivalPlayerAddress!);
                  }}
                />
              </div>
              <div className={styles.moveButtonrb}>
                <Button
                  borderless
                  color='black'
                  size="sm"
                  title="Jump. I move"
                  onClick={() => {
                    onConnect(rivalPlayerAddress!);
                  }}
                />
              </div>
              <div className={styles.moveButtonrr}>
                <Button
                  borderless
                  color='black'
                  size="sm"
                  title="Jump. Let opponent move"
                  onClick={() => {
                    onConnect(rivalPlayerAddress!);
                  }}
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
              <div className={styles.madeAppeal}>{disputeMode.disputeRunner === account.address ? `${t('shade.madeAppeal.runner')}` : `Opponent ${t(
                'shade.madeAppeal.cheater',
              )}`}</div>
              <div className={styles.notice}>{t('shade.notice')}</div>
            </div>
          )}
          {(!!finishGameCheckResult) &&
            <div className={styles.checking_results}>
              {finishGameCheckResult && finishGameCheckResult.winner && !isInvalidMove && !finishGameCheckResult.isDraw && 
                <>
                  <p className={styles.message}>{t('shade.checking.winner')}</p>
                  <Button title={t('shade.checking.checkingWinner')} onClick={onClaimWin} />
                </>
              }
              {finishGameCheckResult && !finishGameCheckResult.winner && !isInvalidMove && !finishGameCheckResult.isDraw && 
                <p className={styles.message}>{t('shade.checking.loser')} {t('shade.checking.checkingLoser')}</p>
              }
              {finishGameCheckResult && finishGameCheckResult.isDraw && !finishGameCheckResult.winner && 
                <>
                  <p className={styles.message}>{t('shade.checking.draw')}</p>
                  <Button title={t('shade.checking.checkingDraw')} onClick={onClaimWin} />
                </>
              }
              {finishGameCheckResult && finishGameCheckResult.winner && isInvalidMove &&
              <>
               <p className={styles.message}>{t('shade.checking.cheatWinner')}</p>
              </> 
              }
              {finishGameCheckResult && !finishGameCheckResult.winner && isInvalidMove &&
              <>
               <p className={styles.message}>{t('shade.checking.cheatLoser')}</p>
               <Button title={t('shade.checking.checkingCheat')} onClick={onRunDisput} />
              </> 
              }
              </div>}
          {!!finishedGameState && (            
              <div className={styles.win}>
                {makeFinishedGameDescription(finishedGameState)}
                <div className={styles.small}>
                  {makeFinishedGameReasonDescription(finishedGameState)}
                </div>
              </div>
          )}
          {!!finishedGameState && (
            <div className={styles.link}>
              <div className={styles.badges}>
                <div className={styles.text}>Issue your ZK Badge</div>
                {makeBadges()}
              </div>
            </div>
          )}
        </div>
      )}
   {!isShowShade && <div className={styles.header}>
        <div className={styles.message}>
          {players && (players[0]?.moves || players[1]?.moves) &&
            <div className={styles.moveMessage}>{players[0].moves ? 'Your move' : 'Opponent\'s move'}</div>}
        </div>
        <div className={styles.prize}></div>
      </div>}
      <div className={styles.gameBoardContainer}>{children}</div>
    </div>
  );
};
