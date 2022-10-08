import { NextPage } from 'next';
import { Checkers } from 'components/Games/Checkers';
import { ICheckersProps } from 'components/Games/Checkers/ICheckersProps';
import styles from '../tests.module.scss';
import { ISignedGameMove } from 'types/arbiter';
import { CheckersState } from 'components/Games/Checkers/types';

const TestGameFieldPage: NextPage = () => {

  const gameState: CheckersState = new CheckersState(
    {
      gameId: 158,
      playerType: 'X'
    }
  );
  const getSignerAddress = async() => {return Promise.resolve('OxSignerAddress')};
  const sendSignedMove = (move: ISignedGameMove) => void {};

  const makeProps = (): ICheckersProps =>  {
    return {
      gameState,
      getSignerAddress,
      sendSignedMove
    }
  }

  const epmtyBoard = makeProps();

  function makeGameFields() {
    return Object.entries({
      empty: epmtyBoard
    }).map(([key, props])=> {
      return <div key={key} className={styles.padding}>
        <h2>{key} props</h2>
        <Checkers
          {...makeProps()}
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