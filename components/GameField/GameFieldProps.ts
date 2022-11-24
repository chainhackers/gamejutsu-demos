import { FinishedGameState } from "gameApi";
import { PlayerI } from "types/game";

export interface GameFieldPropsI {
  children?: React.ReactNode;
  gameId: string | undefined;
  rivalPlayerAddress: string | null;
  isConnected: boolean;
  isInDispute?: boolean;
  finishedGameState: FinishedGameState | null;
  onConnect: (opponent: string) => Promise<void>;
  players?: PlayerI[];
  finishGameCheckResult: { winner: boolean } | null;
  version?: string;
}
