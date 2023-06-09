import { TGameType } from 'types/game';

export interface JoinGameWrapperPropsI {
  children?: React.ReactNode;
  gameType: TGameType;
  onClick: (
    gameId: string,
    stake: string,
    gameType: string,
    proposer: string
  ) => void;
}
