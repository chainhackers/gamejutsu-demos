import { TGameType } from 'types/game';

export interface MyGameCardPropsI {
  children?: React.ReactNode;
  gameId: string;
  winner: string;
  loser: string;
  header?: boolean;
  stake: string;
  proposer: string;
  rules: string;
  gameType: TGameType;
  started: boolean;
  accepter: null | string;
}
