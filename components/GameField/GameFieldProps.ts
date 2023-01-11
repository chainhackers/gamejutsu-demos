import { FinishedGameState } from "gameApi";
import { PlayerI } from "types/game";

export interface GameFieldPropsI {
  children?: React.ReactNode;
  gameId: string | undefined;
  rivalPlayerAddress: string | null;
  isConnected: boolean;
  isInDispute?: boolean;
  disputeMode: { isInDispute: boolean, disputeRunner: string | null };
  finishedGameState: FinishedGameState | null;
  onConnect: (opponent: string) => Promise<void>;
  players?: PlayerI[];
  finishGameCheckResult: { winner: boolean } | null;
  version?: string;
  onClaimWin: () => void;
}
