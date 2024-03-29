import { TGameType } from 'types/game';

export interface JoinGameListPropsI {
  gameType: TGameType;
  onClick: (
    gameId: string,
    stake: string,
    gameType: string,
    proposer: string
  ) => void;
  rulesContractAddress: string | null;
}
