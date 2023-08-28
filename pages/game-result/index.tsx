import {GameResult} from 'components/GameResult';
import styles from './gameResult.module.scss';
import {GameStateContextProvider} from "../../contexts/GameStateContext";

const GameResultPage = () => {
  return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {/*<GameStateContextProvider>*/}
          <GameResult />
          {/*</GameStateContextProvider>*/}
        </div>
      </div>
  );
};
export default GameResultPage;

