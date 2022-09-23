import { NewGameBoard } from 'components/NewGameBoard';
import { GameFieldPropsI } from './GameFieldProps';
import styles from './GameField.module.scss';
export const GameField: React.FC<GameFieldPropsI> = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.room}>Room 1</div>
        <div className={styles.message}>
          Alice please make your first move by clicking on any one of the boxes
        </div>
        <div className={styles.prize}>Prize</div>
      </div>
      <div className={styles.gameBoardContainer}>
        <NewGameBoard />
      </div>
    </div>
  );
};
