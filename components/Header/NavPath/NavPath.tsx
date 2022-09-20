import cn from 'classnames';
import { NavPathPropsI } from './NavPathProps';
import styles from './NavPath.module.scss';
export const NavPath: React.FC<NavPathPropsI> = ({ path }) => {
  const map: { [id: string]: string } = {
    games: 'Game Demo',
    'tic-tac-toe': 'Tic-Tac-Toe game',
  };
  const constructPath = (path: string) =>
    path
      .split('/')
      .filter((el) => el.length !== 0)
      .map((el) => {
        console.log(el, map[el]);
        return map[el] ? map[el] : el;
      });

  const newPaths = constructPath(path);

  return (
    <div className={styles.container}>
      <span>GameJutsu</span>
      {newPaths.map((el, index, arr) => (
        <>
          {' > '}
          <span
            key={el + index}
            className={cn(index === arr.length - 1 ? styles.active : null)}
          >
            {el}
          </span>
        </>
      ))}
    </div>
  );
};
