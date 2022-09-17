import { moveCharsMap } from '../gameConstants';
import { SquarePropsI } from './SquareProps';
import styles from './Square.module.scss';
export const Square: React.FC<SquarePropsI> = ({ value, onClick }) => {
  return (
    <button className={styles.square} onClick={onClick}>
      {value !== null && moveCharsMap[value]}
    </button>
  );
};
