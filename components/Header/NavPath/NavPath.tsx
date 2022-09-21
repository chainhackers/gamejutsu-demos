import cn from 'classnames';
import { NavPathPropsI } from './NavPathProps';
import styles from './NavPath.module.scss';
import { Fragment } from 'react';
export const NavPath: React.FC<NavPathPropsI> = ({ path }) => {
  const map: { [id: string]: string } = {
    games: 'Game Demo',
    'tic-tac-toe': 'Tic-Tac-Toe game',
  };
  const constructPath = (path: string) => {
    console.log('path split', path.split('?')[0]);
    return path
      .split('?')[0]
      .split('/')
      .filter((el) => el.length !== 0)
      .map((el) => {
        console.log(el, map[el]);
        return map[el] ? map[el] : el;
      });
  };

  const newPaths = constructPath(path);

  return (
    <div className={styles.container}>
      <span>GameJutsu</span>
      {newPaths.map((el, index, arr) => (
        <Fragment key={el + index}>
          {' > '}
          <span
            // key={el + index}
            className={cn(index === arr.length - 1 ? styles.active : null)}
          >
            {el}
          </span>
        </Fragment>
      ))}
    </div>
  );
};
