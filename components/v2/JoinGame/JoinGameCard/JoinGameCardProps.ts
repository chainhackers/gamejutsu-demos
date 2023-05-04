export interface JoinGameCardPropsI {
  children?: React.ReactNode;
  gameId: string;
  winner: string;
  loser: string;
  header?: boolean;
  stake: string;
  proposer: string;
  rules: string;
  onClick?: (id: string, stake: string) => void;
}
