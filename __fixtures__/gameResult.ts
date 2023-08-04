import type { NextApiRequest, NextApiResponse } from 'next';

type GameResult = 'win' | 'lose' | 'draw';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const results: GameResult[] = ['win', 'lose', 'draw'];
  const randomIndex = Math.floor(Math.random() * results.length);
  const result = results[randomIndex];

  res.json({ result });
};

export default handler;
