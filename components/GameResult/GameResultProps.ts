export type TGameResult = 'winner' | 'loser' | 'isDraw'
import { PlayerI, TGameType } from 'types/game';
export interface IGameResultProps {
  result: TGameResult;
  gameType: TGameType;
  player1: PlayerI | null;
  player2: PlayerI | null;
}
