import { FinishedGameState } from "gameApi";

export interface GameFieldPropsI {
  children?: React.ReactNode;
  gameId: string | undefined;
  rivalPlayerAddress: string | null;
  isConnected: boolean;
  isInDispute?: boolean;
  finishedGameState: FinishedGameState | null;
  onConnect: (opponent: string) => Promise<void>;
}
