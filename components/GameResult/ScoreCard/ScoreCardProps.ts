import { TGameResult } from '../GameResultProps';
import { TGameType } from 'types/game';
import {StaticImageData} from 'next/image'
export interface ScoreCardProps {
  playerName: string;
  playerImg: string | StaticImageData;
  result: TGameResult;
  showWinText: boolean;
  gameType: TGameType
}
