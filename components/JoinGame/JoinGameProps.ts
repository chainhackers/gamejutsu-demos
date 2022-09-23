export interface JoinGamePropsI {
  children?: React.ReactNode;
  acceptGameHandler: (gameId: string) => Promise<void>;
}
