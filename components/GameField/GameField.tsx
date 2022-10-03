import { useTranslation } from 'react-i18next';
import { GameFieldPropsI } from './GameFieldProps';
import { useQuery } from '@apollo/client';
import { badgesQuery } from 'queries';
import styles from './GameField.module.scss';
import { Button } from 'components/shared';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { FinishedGameState } from 'gameApi';
export const GameField: React.FC<GameFieldPropsI> = ({
  children,
  gameId,
  rivalPlayerAddress,
  isConnected,
  isInDispute,
  finishedGameState,
  onConnect,
}) => {
  const [isShowShade, setShowShade] = useState<boolean>(true);
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
  console.log('queryResponse', data);

  function isOpponentAddress(address: string): boolean {
    return address === rivalPlayerAddress;
  }

  function isCurrentPlayerAddress(address: string | null): boolean {
    return !!address && !isOpponentAddress(address);
  }

  function makeFinishedGameReasonDescription(finishedGameState: FinishedGameState): string | undefined {
    if (finishedGameState.disqualified) {
      if (isOpponentAddress(finishedGameState.disqualified)) {
        return 'and opponent disqualified'
      } else {
        return 'because you disqualified'
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
      setShowDispute(true);
    }
  }, [isInDispute]);

  useEffect(() => {
    if (!!finishedGameState) {
      setShowShade(true);
      setIsWaiting(false);
      setIsConnecting(false);
      setShowDispute(false);
    }
  }, [finishedGameState]);

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

  function countToMedal(count: number): TMedal | undefined {
    if (count == 10) return 'gold';
    if (count == 5) return 'silver';
    if (count == 1) return 'bronze';
  }

  function makeJustObtainedBadge(count: number, achievement: TAchievement): JSX.Element | undefined {
    let medal = countToMedal(count);
    return medal && makeBadge(medal, achievement);
  }

  const makeJustObtainedBadges = () => {
    let entity = data && data.inRowCounterEntities[0];
    if (!entity || !finishedGameState) {
      return;
    }
    if (finishedGameState.isDraw) {
      let badge = makeJustObtainedBadge(entity.drawCount + 1, 'draw');
      return badge &&[badge];
    }
    if (isCurrentPlayerAddress(finishedGameState.winner)) {
      let badge = makeJustObtainedBadge(entity.winnerCount + 1, 'winner');
      return badge &&[badge];
    }
    let badges = []
    if (isCurrentPlayerAddress(finishedGameState.loser)) {
      let badge = makeJustObtainedBadge(entity.loserCount + 1, 'loser');
      badge && badges.push(badge);
    }
    if (isCurrentPlayerAddress(finishedGameState.disqualified)) {
      let badge = makeJustObtainedBadge(entity.cheaterCount + 1, 'cheater');
      badge && badges.push(badge);
    }
    return badges;
  }

  const makeBadge = (medal: TMedal, achievement: TAchievement) => {
    const generateLink = (medal: TMedal, achievement: TAchievement) => {
      return `https://playground.sismo.io/gamejutsu-${medal}-${achievement}`;
    };
    const getBeltFromMedal = (medal: TMedal): TBelt | undefined => {
      if (medal = 'bronze') return 'white';
      if (medal = 'silver') return 'green';
      if (medal = 'gold') return 'black';
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
          )}
        >
          <Image
            src={generateFilename(medal, achievement)}
            width="70px"
            height="70px"
          ></Image>
        </div>
      </a>
    </Link>
  }
  const makeBadges = () => {
    let badges = [];
    for (let achievement of ['winner', 'loser', 'draw', 'cheater'] as TAchievement[]) {
      let rowBadges = [];
      for (let medal of ['bronze', 'silver', 'gold'] as TMedal[]) {
        rowBadges.push(makeBadge(medal, achievement));
      }
      badges.push(<div key={achievement} className={styles.row}>
        {rowBadges}
      </div>)
    }
    return badges;
  }

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
              <div className={styles.madeAppeal}>{`\${disputeAppealPlayer} ${t(
                'shade.madeAppeal',
              )}`}</div>
              <div className={styles.notice}>{t('shade.notice')}</div>
            </div>
          )}
          {finishedGameState && (
            <>
              <div className={styles.win}>
                {makeFinishedGameDescription(finishedGameState)}
              </div>
              <div className={styles.win}>
                {makeFinishedGameReasonDescription(finishedGameState)}
              </div>
            </>
          )}
          {finishedGameState && (
            <div className={styles.link}>
              <div className={styles.badges}>
                <div className={styles.text}>You can issue your ZK Badge:</div>
                <>
                dat new
                {makeJustObtainedBadges()}
                </>
                {makeBadges()}
              </div>
            </div>
          )}
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.room}>Game Id: {gameId ? gameId : 'n/a'}</div>
        <div className={styles.message}>

        </div>
        <div className={styles.prize}></div>
      </div>
      <div className={styles.gameBoardContainer}>{children}</div>
    </div>
  );
};
