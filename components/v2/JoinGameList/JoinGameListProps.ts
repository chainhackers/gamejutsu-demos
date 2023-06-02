export interface JoinGameListPropsI {
  gameType: string;
  onClick: (
    gameId: string,
    stake: string,
    gameType: string,
    proposer: string
  ) => void;
}
