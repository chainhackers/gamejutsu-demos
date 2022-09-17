import { TGameState } from './types';
export interface TikTakToePropsI {
  children?: React.ReactNode;
  gameState?: TGameState;
  playerType?: 'X' | 'O' | null;
  playerIngameId: 0 | 1;
  onGameStateChange?: (gameState: TGameState, move: number) => void;
  encodedMessage: { content: string; sender: string } | null;
  onChangeMessage: (encodedMessage: string) => void;
  gameId: string | null;
  onInvalidMove: () => void;
  onWinner: any;
}
