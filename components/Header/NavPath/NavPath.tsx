import cn from 'classnames';
import Link from 'next/link';
import { NavPathPropsI } from './NavPathProps';
import styles from './NavPath.module.scss';
import { Fragment } from 'react';
export const NavPath: React.FC<NavPathPropsI> = ({ path }) => {
  const map: { [id: string]: string } = {
		games: "Game Demo",
		team: "Team",
    "games/checkers": "Checkers",
		"tic-tac-toe": "Tic-Tac-Toe game",
	}
  const constructPath = (path: string) => {
    if (path === "/") {
			return ["Main Page"]
		}

    const segments = path
			.split("?")[0]
			.split("/")
			.filter(el => el.length !== 0)
			.map(el => {
				return map[el] ? map[el] : el
			})
		return segments
  };

  const newPaths = constructPath(path);

  return (
    <div className={styles.container}>
      {newPaths.map((el, index, arr) => (
        <Fragment key={el + index}>
          {' < '}
          <Link href="/games">
            <a>
              <span
                className={cn(index === arr.length - 1 ? styles.active : null)}
              >
                {el}
              </span>
            </a>
          </Link>
        </Fragment>
      ))}
    </div>
  );
};
