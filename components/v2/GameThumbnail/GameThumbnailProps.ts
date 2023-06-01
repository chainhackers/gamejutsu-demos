import { Dispatch, SetStateAction } from 'react';

export interface GameThumbnailPropsI {
  children?: React.ReactNode;
  name: string;
  image: string;
  url: string;
  description: string;
  setIsTransactionPending: Function;
  setIsRequestConfirmed: Function;
  setTransactionLink: Function;
  // setSelectedTab: Dispatch<SetStateAction<string>>;
}
