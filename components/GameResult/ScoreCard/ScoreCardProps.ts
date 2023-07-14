import { TGameResult } from '../GameResultProps';
import {StaticImageData} from 'next/image'
export interface ScoreCardProps {
  playerName: string;
  playerImg: string | StaticImageData;
  result: TGameResult;
}
