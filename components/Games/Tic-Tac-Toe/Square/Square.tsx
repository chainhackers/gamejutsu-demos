import { SquarePropsI } from './SquareProps';
import styles from './Square.module.scss';
export const Square: React.FC<SquarePropsI> = ({ value, onClick }) => {
    return (
        // <div className={styles.container}>
        <button className={styles.square} onClick={onClick}>
            {value}
        </button>
        // </div>
    );
};
