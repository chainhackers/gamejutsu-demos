import { FinishedGameState } from "gameApi";

export interface GameFieldPropsI {
  children?: React.ReactNode;
  gameId: string | null;
  rivalPlayerAddress: string | null;
  isLoading: boolean;
  isInDispute?: boolean;
  finishedGameState: FinishedGameState | null;
  onConnect: (opponent: string) => Promise<void>;
}
