import { TGameType } from 'types/game';

export interface JoinGameListPropsI {
  gameType: TGameType;
  onClick: (gameId: string, stake: string, gameType: string) => void;
}
