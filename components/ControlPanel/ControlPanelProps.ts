import { Contract, ContractInterface } from 'ethers';
import { IContractData } from 'types';
export interface ControlPanelPropsI {
  children?: React.ReactNode;
  onProposeGame?: (gameId: string) => void;
  onAcceptGame?: () => void;
  onCheckValidMove?: () => void;
  onDisputeMove?: () => void;
  onGetPlayers?: () => void;
  onTransition?: () => void;
  arbiterContractData: IContractData;
  gameRulesContractData: IContractData;
  playersTypes: { [id: number]: string };
}
