import { PlayerI } from "types/game";

export interface PlayersPropsI {
  children?: React.ReactNode;
  player1: PlayerI;
  player2: PlayerI;
  isTimeoutAllowed: boolean;
  initTimeout: () => Promise<void>;
  isResolveTimeoutAllowed: boolean;
  resolveTimeout: () => Promise<void>;
  isFinishTimeOutAllowed: boolean;
  finishTimeout: () => Promise<void>;
  isTimeoutRequested: boolean;
  // connectPlayer: () => Promise<void>;
}
