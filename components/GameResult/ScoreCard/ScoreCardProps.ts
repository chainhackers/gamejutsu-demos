import { TGameResult } from '../GameResultProps';
import { StaticImageData } from 'next/image';
import { ReactNode } from 'react';
export interface ScoreCardProps {
  playerName: string;
  avatarUrl: string | StaticImageData;
  result: TGameResult;
  showWinText: boolean;
  icon: ReactNode;
  gameType: string;
}
