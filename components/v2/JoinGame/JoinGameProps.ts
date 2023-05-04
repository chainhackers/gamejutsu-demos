export interface JoinGamePropsI {
  children?: React.ReactNode;
  games: { name: string; image: string; url: string; description: string }[];
  // acceptGameHandler: (gameId: number, stake: string) => Promise<void>;
}
