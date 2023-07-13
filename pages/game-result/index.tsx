import { useEffect, useState } from 'react';
import { GameResult } from '../../components/GameResult';
import { TGameResult } from '../../components/GameResult/GameResultProps';
const GameResultPage = () => {
  const [result, setResult] = useState<TGameResult>('win');
  return (
    <div>
      <h1>Результат игры</h1>
      <GameResult result={result} />
    </div>
  );
};

export default GameResultPage;
