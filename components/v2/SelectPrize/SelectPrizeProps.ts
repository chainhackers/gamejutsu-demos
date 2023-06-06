import { TGameType } from 'types/game';

export interface SelectPrizePropsI {
  children?: React.ReactNode;
  gameType: TGameType;
  address: boolean;
  url: string;
  setIsTransactionPending: Function;
  setIsRequestConfirmed: Function;
  setTransactionLink: Function;
  openWalletModal: () => void;
}
