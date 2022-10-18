import { NextPage } from 'next';
import { GameField } from 'components';
import { GameFieldPropsI } from 'components/GameField/GameFieldProps';
import { FinishedGameState } from 'gameApi';
import styles from '../tests.module.scss';

const TestGameFieldPage: NextPage = () => {

  const currentAddress = '0xYourAddress';
  const opponentAddress = '0xOpponentAddress';

  const makeWinner = () => FinishedGameState.fromGameFinishedArgs(
    {
      winner: currentAddress,
      loser: opponentAddress,
      isDraw: false,
      gameId: 158
    }
  );

  const makeLoser = () => FinishedGameState.fromGameFinishedArgs(
    {
      winner: opponentAddress,
      loser: currentAddress,
      isDraw: false,
      gameId: 158
    }
  );

  const gameInProgress = null;

  const draw = FinishedGameState.fromGameFinishedArgs(
    {
      winner: currentAddress,
      loser: opponentAddress,
      isDraw: true,
      gameId: 158
    }
  )

  const youWins = makeWinner();

  const youLose = makeLoser();

  const youResigned = makeLoser().addPlayerResigned({
    gameId: 158,
    player: currentAddress,
  })

  const opponentResigned = makeWinner().addPlayerResigned({
    gameId: 158,
    player: opponentAddress,
  })

  const youCheated = makeLoser().addPlayerDisqualified({
    gameId: 158,
    player: currentAddress,
  })

  const opponentCheated = makeWinner().addPlayerDisqualified({
    gameId: 158,
    player: opponentAddress,
  })

  const makeProps = (finishedGameState: FinishedGameState | null): GameFieldPropsI => {
    return {
      gameId: '158',
      rivalPlayerAddress: opponentAddress,
      isConnected: true,
      isInDispute: false,
      finishedGameState,
      onConnect: async (opponent) => { }
    }
  }

  function makeGameFields() {
    return Object.entries({
      gameInProgress, draw,
      youWins, youLose,
      opponentResigned, youResigned,
      opponentCheated, youCheated
    }).map(([key, props])=> {
      return <div key={key} className={styles.padding}>
        <h2>{key} props</h2>
        <GameField
          {...makeProps(props)}
        >
        </GameField>
      </div>
    });
  }

  return (
    <div className={styles.row}>
      { makeGameFields() }
    </div>
  );
};

export default TestGameFieldPage;