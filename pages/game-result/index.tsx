import { useEffect, useState } from 'react';
import { GameResult } from 'components/GameResult';
import { TGameResult } from 'components/GameResult/GameResultProps';
import styles from './gameResult.module.scss';
const GameResultPage = () => {
  const [resultIndex, setResultIndex] = useState(0);
  const results: TGameResult[] = ['win','lose', 'draw'];

  const handleButtonClick = () => {
    setResultIndex((prevIndex) => (prevIndex + 1) % results.length);
  };
  const currentResult = results[resultIndex];
  return (
    <div className={styles.container}>
      <button onClick={handleButtonClick} className='p-2 bg-slate-600 text-[#C89DFB] text-4xl w-[300px] rounded-3xl m-2 place-content-center'>
        Переключить результат
      </button>
      <GameResult result={currentResult} />
    </div>
  );
};

export default GameResultPage;
