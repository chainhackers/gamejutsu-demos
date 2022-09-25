export interface SelectPrizePropsI {
  children?: React.ReactNode;
  gameId: string | null;
  createNewGameHandler: (isPaid?: boolean) => Promise<void>;
}
