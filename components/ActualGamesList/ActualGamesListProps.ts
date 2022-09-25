export interface ActualGamesListPropsI {
  children?: React.ReactNode;
  gamesList: any[];
  onClick: (gameId: string, stake: string) => void;
}
