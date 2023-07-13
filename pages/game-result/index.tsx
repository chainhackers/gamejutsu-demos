import { useEffect, useState } from 'react';
import { GameResult } from 'components/GameResult';
import { TGameResult } from 'components/GameResult/GameResultProps';
import styles from './gameResult.module.scss';
const GameResultPage = () => {
  const [result, setResult] = useState<TGameResult>('win');
  return (
    <div className={styles.container}>
      <GameResult result={result} />
    </div>
  );
};

export default GameResultPage;
