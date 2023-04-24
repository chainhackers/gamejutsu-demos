import { TGameType } from 'types/game';

export interface SelectPrizePropsI {
  children?: React.ReactNode;
  gameType: TGameType;
  address: boolean;
  url: string;
  isTransactionPending: boolean;
  setIsTransactionPending: Function;
  isRequestConfirmed: boolean;
  setIsRequestConfirmed: Function;
}
