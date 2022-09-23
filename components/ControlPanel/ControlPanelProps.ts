import { IContractData } from 'types';
import React from "react";
export interface ControlPanelPropsI {
  children?: React.ReactNode;
  onProposeGame: (gameId: string | null) => void;
  onAcceptGame: (gameId: string | null) => void;
  onCheckValidMove?: () => void;
  onDisputeMove?: () => void;
  onGetPlayers?: () => void;
  onTransition?: () => void;
  arbiterContractData: IContractData;
  gameRulesContractData: IContractData;
  playersTypes: { [id: number]: string };
  onConnectPlayer: (rivalPlayerAddress: string) => Promise<void>;
  onSetPlayerIngameId: any;
  winner: number | null;
  rivalPlayerConversationStatus: string | null;
  isInDispute: boolean;
  isInvalidMove: boolean;
  onDispute: () => void;
}
