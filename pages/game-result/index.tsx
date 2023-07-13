import { useEffect, useState } from 'react';
import { GameResult } from '../../components/GameResult';
import { TGameResult } from '../../components/GameResult/GameResultProps';
import styles from './gameResult.module.scss'
const GameResultPage = () => {
  const [result, setResult] = useState<TGameResult>('lose');
  return (
    <div className={styles.container}>
      <h1>GAME RESULT</h1>
      <GameResult result={result} />
    </div>
  );
};

export default GameResultPage;
