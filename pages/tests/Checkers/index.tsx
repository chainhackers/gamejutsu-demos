import { NextPage } from 'next';
import { Checkers } from 'components/Games/Checkers';
import { ICheckersProps } from 'components/Games/Checkers/ICheckersProps';
import styles from '../tests.module.scss';
import { ISignedGameMove } from 'types/arbiter';
import { CheckersState } from 'components/Games/Checkers/types';

const TestGameFieldPage: NextPage = () => {

  const gameStateX: CheckersState = new CheckersState(
    {
      gameId: 158,
      playerType: 'X'
    }
  );

  const gameStateO: CheckersState = new CheckersState(
    {
      gameId: 158,
      playerType: 'O'
    }
  );

  const gameStateOO: CheckersState = new CheckersState(
    {
      gameId: 158,
      playerType: 'O'
    }
  );

  gameStateOO.currentBoard.cells = [
    'XX', 'XX', 'XX', 'XX', 'X', 'X', 'X', 'X',
    'X', 'X', 'X', 'X', null, null, null, null,
    null, null, null, null, 'O', 'O', 'O', 'O',
    'O', 'O', 'O', 'OO', 'OO', 'OO', 'OO', 'OO',
  ];

  const getSignerAddress = async() => {return Promise.resolve('OxSignerAddress')};
  const sendSignedMove = (move: ISignedGameMove) => void {};

  const makeProps = (gameState:CheckersState): ICheckersProps =>  {
    return {
      gameState,
      getSignerAddress,
      sendSignedMove,
      playerIngameId: 0,
    }
  }

  function makeGameFields() {
    return Object.entries({
      gameStateX, gameStateO, gameStateOO
    }).map(([key, props])=> {
      return <div key={key} className={styles.padding}>
        <h2>{key} props</h2>
        <Checkers
          {...makeProps(props)}
        >
        </Checkers>
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