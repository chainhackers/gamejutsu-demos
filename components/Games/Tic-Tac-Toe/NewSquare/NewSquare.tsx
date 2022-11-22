import cn from 'classnames';
import { NewSquarePropsI } from './NewSquareProps';
import styles from './NewSquare.module.scss';
export const NewSquare: React.FC<NewSquarePropsI> = ({ value, onClick, disputable }) => {
  return (
    <div
      className={cn(styles.square, disputable ? styles.disputable : null)}
      onClick={onClick}
    >
      {value}
    </div>
  );
};
