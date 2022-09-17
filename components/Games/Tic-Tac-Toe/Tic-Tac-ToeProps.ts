import { TGameState } from './types';
export interface TikTakToePropsI {
  children?: React.ReactNode;
  gameState: TGameState;
  playerType: 'X' | 'O' | null;
  playerIngameId: 0 | 1;
  onGameStateChange: (gameState: TGameState) => void;
  // sendState: () => void;
}
