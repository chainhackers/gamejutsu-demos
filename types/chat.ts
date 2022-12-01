import { FinishedGameState } from 'gameApi';
import { TGameType } from 'types/game';
import { ISignedGameMove } from './arbiter';

export type TMessageType = ISignedGameMove;
// | GameProposedEventObject
// | GameStartedEventObject
// | GameFinishedEventObject
// | TimeoutStartedEventObject
// | TimeoutResolvedEventObject
// | FinishedGameState;

export interface IGameMessage {
  gameType: TGameType;
  gameId: number;
  messageType:
    | 'ISignedGameMove'
    | 'GameProposedEvent'
    | 'GameStartedEvent'
    | 'GameFinishedEvent'
    | 'TimeoutStartedEvent'
    | 'TimeoutResolvedEvent'
    | 'FinishedGameState';
  message: TMessageType;
}

export interface IAnyMessage extends IGameMessage {
  underlyingMessage: any;
}

export interface IChatLogMessage {
  gameId: string;
  messageType: 'ISignedGameMove' | string;
  gameType: string;
  nonce: number;
  senderAddress: string;
  recipientAddress: string;
  sent: number;
  message: {
    signatures: string[];
    gameMove: {
      gameId: number;
      nonce: number;
      player: string;
      oldState: any;
      newState: any;
      move: string;
    };
  };
}
