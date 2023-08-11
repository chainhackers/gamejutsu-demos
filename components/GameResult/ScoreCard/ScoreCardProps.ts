import { TGameResult } from '../GameResultProps';
import { StaticImageData } from 'next/image';
import { ReactNode } from 'react';
import { PlayerI, TGameType } from 'types/game';
export interface ScoreCardProps {
  playerName: PlayerI[];
  avatarUrl: string | StaticImageData;
  result: TGameResult;
  showWinText: boolean;
  icon: ReactNode;
  gameType: TGameType;
}
