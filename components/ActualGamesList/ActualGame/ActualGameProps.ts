export interface ActualGamePropsI {
  children?: React.ReactNode;
  gameId: string;
  winner: string;
  loser: string;
  header?: boolean;
  onClick?: (id: string) => void;
}
