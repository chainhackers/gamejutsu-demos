import { TGameResult } from '../GameResultProps';
import { StaticImageData } from 'next/image';
import { ReactNode } from 'react';
export interface ScoreCardProps {
  playerName: string;
  playerImg: string | StaticImageData;
  result: TGameResult;
  showWinText: boolean;
  icon: ReactNode;
}
