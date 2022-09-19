import cn from 'classnames';
import { moveCharsMap } from '../gameConstants';
import { SquarePropsI } from './SquareProps';
import styles from './Square.module.scss';

export const Square: React.FC<SquarePropsI> = ({ value, onClick, disputive }) => {
  return (
    <button
      className={cn(styles.square, disputive ? styles.disputive : null)}
      onClick={onClick}
    >
      {value !== null && moveCharsMap[value]}
    </button>
  );
};
