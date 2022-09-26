import cn from 'classnames';
import { NewSquarePropsI } from './NewSquareProps';
import styles from './NewSquare.module.scss';
export const NewSquare: React.FC<NewSquarePropsI> = ({ value }) => {
  return <div className={styles.square}>{value}</div>;
};
