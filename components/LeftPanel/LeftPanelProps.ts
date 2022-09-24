import { PlayerI } from 'types';
export interface LeftPanelPropsI {
  children?: React.ReactNode;
  players: PlayerI[];
  isTimeoutAllowed: boolean;
  initTimeout: () => Promise<void>;
  isResolveTimeoutAllowed: boolean;
  resolveTimeout: () => Promise<void>;
  finishTimeout: () => Promise<void>;
  isFinishTimeOutAllowed: boolean;
  isTimeoutRequested: boolean;
  connectPlayer: () => Promise<void>;
}
