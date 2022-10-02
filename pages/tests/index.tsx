import { NextPage } from 'next';
import { GameField } from 'components';
import { GameFieldPropsI } from 'components/GameField/GameFieldProps';
import { FinishedGameState } from 'gameApi';
import styles from './test.module.scss';

const TestsPage: NextPage = () => {

  const currentAddress = '0xYourAddress';
  const opponentAddress = '0xOpponentAddress';

  const youWins = FinishedGameState.fromGameFinishedArgs(
    {
      winner: currentAddress,
      loser: opponentAddress,
      isDraw: false,
      gameId: 158
    }
  )

  const youLose = FinishedGameState.fromGameFinishedArgs(
    {
      winner: opponentAddress,
      loser: currentAddress,
      isDraw: false,
      gameId: 158
    }
  )

  const youResigned = FinishedGameState.fromGameFinishedArgs(
    {
      winner: opponentAddress,
      loser: currentAddress,
      isDraw: false,
      gameId: 158
    }
  ).addPlayerResigned({
    gameId: 158,
    player: currentAddress,
  })

  const makeProps = (finishedGameState: FinishedGameState): GameFieldPropsI => {
    return {
      gameId: '158',
      rivalPlayerAddress: opponentAddress,
      isConnected: true,
      isInDispute: false,
      finishedGameState,
      onConnect: async (opponent) => { }
    }
  }

  return (
    <div className={styles.row}>
      <div className={styles.padding}>
        <h2>You win props</h2>
        <GameField
          {...makeProps(youWins)}
        >
        </GameField>
      </div>
      <div className={styles.padding}>
        <h2>Opponent wins props</h2>
        <GameField
          {...makeProps(youLose)}
        >
        </GameField>
      </div>
      <div className={styles.padding}>
        <h2>You resigned props</h2>
        <GameField
          {...makeProps(youResigned)}
        >
        </GameField>
      </div>
    </div>
  );
};

export default TestsPage;