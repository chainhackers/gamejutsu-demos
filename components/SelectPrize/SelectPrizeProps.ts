export interface SelectPrizePropsI {
  children?: React.ReactNode;
  gameId: string | null;
  createNewGameHandler: () => Promise<void>;
}
