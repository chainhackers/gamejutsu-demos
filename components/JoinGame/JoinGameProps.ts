export interface JoinGamePropsI {
  children?: React.ReactNode;
  acceptGameHandler: (gameId: string, stake: string) => Promise<void>;
}
