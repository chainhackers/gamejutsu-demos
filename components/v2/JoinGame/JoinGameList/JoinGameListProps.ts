import { TGameType } from 'types/game';

export interface JoinGameListPropsI {
  gameType: TGameType;
  onClick: (
    gameId: string,
    stake: string,
    gameType: string,
    proposer: string
  ) => void;
  // setIsTransactionPending: Function;
  // setIsRequestConfirmed: Function;
  // setTransactionLink: Function;
}
