import { TGameState } from './types';
export interface TikTakToePropsI {
  children?: React.ReactNode;
  gameState?: TGameState;
  playerType?: 'X' | 'O' | null;
  playerIngameId: 0 | 1;
  onGameStateChange?: (gameState: TGameState, move: number) => void;
  encodedMessage: { content: any; sender: string } | null;
  onChangeMessage: (
    encodedMessage: string,
    gameMove: { nonce: number; oldState: string; newState: string; move: string },
  ) => void;
  gameId: string | null;
  onInvalidMove: () => void;
  onWinner: any;
}
