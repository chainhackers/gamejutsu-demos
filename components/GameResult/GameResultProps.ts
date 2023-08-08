export type TGameResult = 'win' | 'lose' | 'draw'
import { TGameType } from 'types/game';
export interface IGameResultProps {
  result: TGameResult;
  gameType: TGameType;
}
