import { NewSquare } from 'components/NewSquare';
import { NewGameBoardPropsI } from './NewGameBoardProps';
import styles from './NewGameBoard.module.scss';
export const NewGameBoard: React.FC<NewGameBoardPropsI> = () => {
  const squares: ('O' | 'X' | null)[] = ['O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'X'];
  const renderSquare = (i: number) => (
    <NewSquare
      value={squares[i]}
      // onClick={() => onClick(i)} disputive={i === disputiveMove}
    />
  );
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className={styles.row}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className={styles.row}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};
