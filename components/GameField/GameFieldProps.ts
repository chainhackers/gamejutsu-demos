import { FinishedGameState } from "gameApi";

export interface GameFieldPropsI {
  children?: React.ReactNode;
  gameId: string | null;
  rivalPlayerAddress: string | null;
  isConnected: boolean;
  isInDispute?: boolean;
  disputeAppealPlayer: string | null;
  finishedGameState: FinishedGameState | null;
  onConnect: (opponent: string) => Promise<void>;
}
