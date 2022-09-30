import { FinishedGameState } from "gameApi";
import React from "react";
export interface ControlPanelPropsI {
  children?: React.ReactNode;
  onProposeGame: (gameId: string | null) => void;
  onAcceptGame: (gameId: string | null) => void;
  onCheckValidMove?: () => void;
  onDisputeMove?: () => void;
  onGetPlayers?: () => void;
  onTransition?: () => void;
  gameType?: string;
  playersTypes: { [id: number]: string };
  onConnectPlayer: (rivalPlayerAddress: string) => Promise<void>;
  onSetPlayerIngameId: any;
  finishedGameState:FinishedGameState | null;
  rivalPlayerConversationStatus: string | null;
  isInDispute: boolean;
  isInvalidMove: boolean;
  onFinishGame: () => void;
  onDispute: () => void;
  onInitTimeout: () => void;
  onResolveTimeout: () => void;
  onFinalizeTimeout: () => void;
  gameId: string | null;
}
