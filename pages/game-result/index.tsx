import { GameResult } from 'components/GameResult'
import styles from './gameResult.module.scss'

const GameResultPage = () => {
  return (<div className={styles.wrapper}>
      <div className={styles.container}>
        <GameResult/>
      </div>
    </div>)
}
export default GameResultPage

