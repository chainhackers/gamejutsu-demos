import { StaticImageData } from 'next/image';
import { ReactNode } from 'react';
import { PlayerI } from 'types/game';
export interface ScoreCardProps {
  playerName: string;
  playerImg: string | StaticImageData;
  showWinText: boolean;
  icon: ReactNode;
  playerIndex: number;
  players?: PlayerI[];
  finishGameCheckResult: {
    winner: boolean;
    isDraw: boolean;
    cheatWin: boolean;
  } | null;
}
