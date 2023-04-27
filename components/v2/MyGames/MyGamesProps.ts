export interface MyGamesPropsI {
  children?: React.ReactNode;
  games: { name: string; image: string; url: string; description: string }[];
}
