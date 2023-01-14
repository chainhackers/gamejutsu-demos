export interface ActualGamePropsI {
  children?: React.ReactNode;
  gameId: string;
  winner: string;
  loser: string;
  header?: boolean;
  onClick?: (id: string, stake: string) => void;
  stake: string;
  proposer: string;
  rules: string;
  ticTacToeAddress: string;
  checkersAddress: string;
}
