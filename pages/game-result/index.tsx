import { useState } from 'react';
import { GameResult } from 'components/GameResult';
import { TGameResult } from 'components/GameResult/GameResultProps';
import styles from './gameResult.module.scss';
const GameResultPage = () => {
  const [resultIndex, setResultIndex] = useState(0);
  const [gameType, setGameType] = useState<'tic-tac-toe' | 'checkers'>('checkers');
  const results: TGameResult[] = ['win', 'lose', 'draw'];

  const handleButtonClick = () => {
    setResultIndex((prevIndex) => (prevIndex + 1) % results.length);
  };
  const handleGameTypeButtonClick = () => {
    setGameType((prevGameType) => (prevGameType === 'tic-tac-toe' ? 'checkers' : 'tic-tac-toe'));
  };

  const currentResult = results[resultIndex];
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button onClick={handleButtonClick} className='p-2 bg-slate-600 text-[#C89DFB] text-4xl w-[300px] rounded-3xl m-2 place-content-center'>
          Переключить результат
        </button>
        <button onClick={handleGameTypeButtonClick} className='p-2 bg-slate-600 text-[#C89DFB] text-4xl w-[300px] rounded-3xl m-2 place-content-center'>
          Переключить игру
        </button>
        <GameResult result={currentResult} gameType={gameType} finishGameCheckResult={null} finishedGameState={null} />
      </div>
    </div>
  );
};

export default GameResultPage;
