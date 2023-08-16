export type TGameResult = 'winner' | 'loser' | 'isDraw'
import { FinishedGameState } from 'gameApi';
import { PlayerI, TGameType } from 'types/game';
export interface IGameResultProps {
  finishGameCheckResult: { winner: boolean; isDraw: boolean; cheatWin: boolean } | null;
  finishedGameState: FinishedGameState | null;
  players?: PlayerI[];
  result?: TGameResult;
  gameType?: TGameType;
  gameId?: string | undefined;
}
