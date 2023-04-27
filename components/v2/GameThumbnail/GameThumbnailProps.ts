export interface GameThumbnailPropsI {
  children?: React.ReactNode;
  name: string;
  image: string;
  url: string;
  description: string;
  isTransactionPending: boolean;
  setIsTransactionPending: Function;
  isRequestConfirmed: boolean;
  setIsRequestConfirmed: Function;
  transactionLink: string;
  setTransactionLink: Function;
}
