import { IContractData } from 'types';
export interface SelectGamePropsI {
  children?: React.ReactNode;
  userName?: string;
  gameType: string;
  onProposeGame: (gameId: string | null) => void;
  arbiterContractData: IContractData;
  gameRulesContractData: IContractData;
}
