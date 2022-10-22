export interface JoinGamePropsI {
  children?: React.ReactNode;
  acceptGameHandler: (gameId: number, stake: string) => Promise<void>;
}
