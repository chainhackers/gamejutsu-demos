import { useTranslation } from 'react-i18next';
import { ActualGame } from './ActualGame/ActualGame';
import { ActualGamesListPropsI } from './ActualGamesListProps';
import styles from './ActualGamesList.module.scss';
import { useRouter } from 'next/router';
import { TGameType } from 'types/game';
export const ActualGamesList: React.FC<ActualGamesListPropsI> = ({ gamesList, onClick }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const gameType = router.query.gameType as TGameType
  return (
    <div className={styles.container}>
      <ActualGame
        gameId={t('gamesList.header.id')}
        winner={t('gamesList.header.winner')}
        loser={t('gamesList.header.loser')}
        stake="stake"
        proposer="proposer"
        rules="game rules"
        header
      />
      {gamesList
        .slice()
        .sort((a, b) => b.id - a.id)
        .map((game) => (
          <ActualGame key={game.gameId} {...game} rules={gameType}  onClick={onClick} />
        ))}
    </div>
  );
};
