import { useTranslation } from 'react-i18next';
import { ActualGame } from './ActualGame/ActualGame';
import { ActualGamesListPropsI } from './ActualGamesListProps';
import styles from './ActualGamesList.module.scss';
import { getRulesContract } from 'gameApi';
import { useState } from 'react';
export const ActualGamesList: React.FC<ActualGamesListPropsI> = ({ gamesList, onClick }) => {
  const { t } = useTranslation();

  let [ticTacToeAddress, setTicTacToeAddress] = useState('')
  let [checkersAddress, setCheckersAddress] = useState('')

  getRulesContract('tic-tac-toe').then(function(response) {
    setTicTacToeAddress(ticTacToeAddress = response.address.toLowerCase())
  })
  getRulesContract('checkers').then(function(response) {
    setCheckersAddress(checkersAddress = response.address.toLowerCase())
  })
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
        ticTacToeAddress={ticTacToeAddress}
        checkersAddress={checkersAddress}
      />
      {gamesList
        .slice()
        .sort((a, b) => b.id - a.id)
        .map((game) => (
          <ActualGame key={game.gameId} ticTacToeAddress={ticTacToeAddress} checkersAddress={checkersAddress} {...game} onClick={onClick} />
        ))}
    </div>
  );
};
