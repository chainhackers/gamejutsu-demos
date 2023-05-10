import { TGameType } from 'types/game';

export interface JoinGameCardPropsI {
  children?: React.ReactNode;
  gameId: string;
  winner: string;
  loser: string;
  header?: boolean;
  stake: string;
  proposer: string;
  rules: string;
  gameType: TGameType;
  onClick?: (
    gameId: string,
    stake: string,
    gameType: string,
    proposer: string
  ) => void;
}
