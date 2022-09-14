import { NextPage } from 'next';
import Link from 'next/link';
import styles from 'pages/games/games.module.scss';

const GamesPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gamelist}>
        <h1 className={styles.title}>Games</h1>
        <Link href="/games/tic-tac-toe">
          <a>
            <div className={styles.gameElement}>Tic-Tac-Toe</div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default GamesPage;
