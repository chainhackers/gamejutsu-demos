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
import { compileString } from 'sass';
export const GameField: React.FC<GameFieldPropsI> = ({
  children,
  gameId,
  rivalPlayerAddress,
  isConnected,
  isInDispute,
  finishedGameState,
  disputeAppealPlayer,
  onConnect,
}) => {
  const [isShowShade, setShowShade] = useState<boolean>(true);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isShowReport, setShowReport] = useState<boolean>(false);
  const [isShowDispute, setShowDispute] = useState<boolean>(false);
  const [isBadge, setIsBadge] = useState<boolean>(true);
  const [availableBadges, setAvailableBadges] = useState<{
    winner: number[];
    loser: number[];
    cheater: number[];
    draw: number[];
  } | null>(null);
  const { t } = useTranslation();
  const appealedPlayer = 'Player 1';
  const account = useAccount();
  console.log('quer', account.address);

  const { data, error, loading } = useQuery(badgesQuery, {
    variables: { id: account.address?.toLowerCase() },
  });

  const generateLink = (belt: number, type: 'winner' | 'loser' | 'draw' | 'cheater') => {
    const belts: { [id: number]: string } = {
      1: 'bronze',
      5: 'silver',
      10: 'gold',
    };

    const types = {
      winner: 'winner',
      loser: 'loser',
      cheater: 'cheater',
      draw: 'draw',
    };
    return `https://playground.sismo.io/gamejutsu-${belts[belt]}-${types[type]}`;
  };

  console.log('query', data);
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

  useEffect(() => {
    console.log('badges', finishedGameState, data);
    // if (isWinner) {

    if (finishedGameState) {
      console.log('badges data', data);
      if (!!data && !!data.inRowCounterEntities[0]) {
        console.log('badges', data);

        const winner = data.inRowCounterEntities[0].winnerMaxValue;
        const loser = data.inRowCounterEntities[0].loserMaxValue;
        const cheater = data.inRowCounterEntities[0].cheaterMaxValue;
        const draw = data.inRowCounterEntities[0].drawMaxValue;

        console.log('test test data data data', winner, loser, cheater, draw);

        const getAvailableBadges = (quantity: number) => {
          console.log('test test data data data', quantity);
          let result: number[] = [];
          switch (true) {
            case quantity >= 10:
              result = [1, 5, 10];
              break;

            case quantity >= 5:
              result = [1, 5];
              break;
            case quantity >= 1:
              result = [1];
              break;
            default:
              break;
            // throw new Error('getting abailable badges failed');
          }

          return result;
        };

        const availableBadges = {
          winner: getAvailableBadges(winner),
          loser: getAvailableBadges(loser),
          cheater: getAvailableBadges(cheater),
          draw: getAvailableBadges(draw),
        };
        setAvailableBadges(availableBadges);
      }
    }
  }, [data, finishedGameState]);
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
              <div className={styles.madeAppeal}>{`${disputeAppealPlayer} ${t(
                'shade.madeAppeal',
              )}`}</div>
              <div className={styles.notice}>{t('shade.notice')}</div>
            </div>
          )}
          {finishedGameState && (
            <div className={styles.win}>
              {JSON.stringify(finishedGameState)}
            </div>
          )}
          {finishedGameState && availableBadges && (
            <>
              <div className={styles.link}>
                <div className={styles.badges}>
                  <div className={styles.text}>You can issue your ZK Badge:</div>
                  <div className={styles.row}>
                    {availableBadges.winner.includes(1) ? (
                      <Link target="_blank" href={generateLink(1, 'winner')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.winner.includes(1) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_winner_white.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_winner_white.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                    {availableBadges.loser.includes(1) ? (
                      <Link target="_blank" href={generateLink(1, 'loser')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.loser.includes(1) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_loser_white.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_loser_white.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                    {availableBadges.cheater.includes(1) ? (
                      <Link target="_blank" href={generateLink(1, 'cheater')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.cheater.includes(1) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_cheater_white.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_cheater_white.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                    {availableBadges.draw.includes(1) ? (
                      <Link target="_blank" href={generateLink(1, 'draw')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.draw.includes(1) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_draw_white.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_draw_white.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                  </div>
                  <div className={styles.row}>
                    {availableBadges.winner.includes(5) ? (
                      <Link target="_blank" href={generateLink(5, 'winner')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.winner.includes(5) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_winner_green.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_winner_green.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                    {availableBadges.loser.includes(5) ? (
                      <Link target="_blank" href={generateLink(5, 'loser')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.loser.includes(5) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_loser_green.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_loser_green.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                    {availableBadges.cheater.includes(5) ? (
                      <Link target="_blank" href={generateLink(5, 'cheater')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.cheater.includes(5) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_cheater_green.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_cheater_green.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                    {availableBadges.draw.includes(5) ? (
                      <Link target="_blank" href={generateLink(5, 'draw')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.draw.includes(5) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_draw_green.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_draw_green.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                  </div>
                  <div className={styles.row}>
                    {availableBadges.winner.includes(10) ? (
                      <Link target="_blank" href={generateLink(10, 'winner')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.winner.includes(10) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_winner_black.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_winner_black.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                    {availableBadges.loser.includes(10) ? (
                      <Link target="_blank" href={generateLink(10, 'loser')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.loser.includes(10) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_loser_black.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_loser_black.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                    {availableBadges.cheater.includes(10) ? (
                      <Link target="_blank" href={generateLink(10, 'cheater')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.cheater.includes(10) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_cheater_black.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_cheater_black.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                    {availableBadges.draw.includes(10) ? (
                      <Link target="_blank" href={generateLink(10, 'draw')}>
                        <a>
                          <div
                            className={cn(
                              styles.badge,
                              availableBadges.draw.includes(10) ? styles.available : null,
                            )}
                          >
                            <Image
                              src="/badges/gamejutsu_draw_black.svg"
                              width="70px"
                              height="70px"
                            ></Image>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className={cn(styles.badge)}>
                        <Image
                          src="/badges/gamejutsu_draw_black.svg"
                          width="70px"
                          height="70px"
                        ></Image>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
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
