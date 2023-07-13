import { GameResult } from '../../components/GameResult';

const GameResultPage = () => {
  const result = 'win'; // Здесь использовать мок данные

  return (
    <div className='game-result-page'>
      <h1>Game Result Page</h1>
      <GameResult result={result} />
    </div>
  );
};

export default GameResultPage;
