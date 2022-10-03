import { XMTPChatLogElement } from 'components/XMTPChatLog/XMTPChatLogElement';
import { XMTPChatLogPropsI } from './XMTPChatLogProps';
import { defaultAbiCoder } from 'ethers/lib/utils';
import styles from './XMTPChatLog.module.scss';
import { TIC_TAC_TOE_MOVE_TYPES, TicTacToeBoard, TTTMove } from "../Games/ET-Tic-Tac-Toe/types";
import { IMyGameState } from "../Games/types";
import { CHECKERS_MOVE_TYPES, CheckersBoard, CHECKERSMove } from "../Games/Checkers/types";
import React from "react";
import { ISignedGameMove } from 'types/arbiter';
import {IChatLog} from "../../types";

export interface ISignedGameMoveInMessage extends ISignedGameMove {
  gameType: string;
}

export function asSignedGameMoveInMessage(parsedObject: any): ISignedGameMoveInMessage | null {
  let gameMove = parsedObject?.gameMove;
  let oldState = gameMove?.oldState;
  let newState = gameMove?.newState;
  let gameType = parsedObject?.gameType
  if (!oldState || !newState || !gameType) {
    return null;
  }
  return parsedObject;
}

export const XMTPChatLog: React.FC<XMTPChatLogPropsI> = ({ logData, isLoading }) => {
  let slicedLogData = logData.slice(0, 10);
  let prettyLogData = slicedLogData.map((message) => {
  console.log('message', message);
    let parsedMessage: any = null;
    try {
      parsedMessage = message.content && JSON.parse(message.content); //TODO add more filters - valid JSON can contain non-valid messages
    } catch (e) {
      console.warn('Failed to parse message', message);
      return null;
    }
    const signedGameMove = asSignedGameMoveInMessage(parsedMessage);

    if (!signedGameMove) {
      return message;
    }

    let oldState: IMyGameState<TTTMove | CHECKERSMove> | null = null;
    let newState: IMyGameState<TTTMove | CHECKERSMove> | null = null;
    let move: string | null;

    if (signedGameMove.gameType == 'tic-tac-toe') {
      oldState = TicTacToeBoard.fromEncoded(signedGameMove.gameMove.oldEncodedGameBoard);
      newState = TicTacToeBoard.fromEncoded(signedGameMove.gameMove.newEncodedGameBoard);
      move = JSON.stringify(
        defaultAbiCoder.decode(TIC_TAC_TOE_MOVE_TYPES, signedGameMove.gameMove.encodedMove)
      );
    } else {
      oldState = CheckersBoard.fromEncoded(signedGameMove.gameMove.oldEncodedGameBoard);
      newState = CheckersBoard.fromEncoded(signedGameMove.gameMove.newEncodedGameBoard);
      move = JSON.stringify(
        defaultAbiCoder.decode(CHECKERS_MOVE_TYPES, signedGameMove.gameMove.encodedMove)
      );
    }
    const id = message.id.slice(0, 17) + '...' + message.id.slice(-17);

    return {
      id: id,
      sender: message.sender,
      recepient: message.recepient,
      timestamp: message.timestamp,
      signatures: signedGameMove.signatures,
      move: move,
      oldState: JSON.stringify(oldState),
      newState: JSON.stringify(newState),
      content: message.content,
    };
  }).filter(msg => msg != null) as IChatLog[] ;

  return (
    <div className={styles.container}>
      <div className={styles.title}>XMTPChatLog</div>
      <div className={styles.loader}>{`Satus: ${prettyLogData.length === 0 ? 'Waiting...' : isLoading ? 'Fetching...' : 'Ready'
        }`}</div>
      <div className={styles.log}>
        {prettyLogData.map((log) => (
          <XMTPChatLogElement key={log.id} {...log} />
        ))}
      </div>
    </div>
  );
};
