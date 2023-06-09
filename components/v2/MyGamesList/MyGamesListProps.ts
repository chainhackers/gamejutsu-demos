import { TGameType } from 'types/game';

export interface MyGamesListPropsI {
  children?: React.ReactNode;
  gameType: TGameType;
  rulesContractAddress: string | null;
}
