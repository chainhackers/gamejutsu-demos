export interface SelectPrizePropsI {
  children?: React.ReactNode;
  gameId: string | undefined;
  createNewGameHandler: (isPaid?: boolean) => Promise<number>;
}
