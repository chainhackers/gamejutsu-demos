import { XMTPChatLogElement } from 'components/XMTPChatLog/XMTPChatLogElement';
import { XMTPChatLogPropsI } from './XMTPChatLogProps';
import { defaultAbiCoder } from 'ethers/lib/utils';
import styles from './XMTPChatLog.module.scss';
import { TIC_TAC_TOE_MOVE_TYPES, TicTacToeBoard, TTTMove } from "../Games/ET-Tic-Tac-Toe/types";
import { IMyGameBoard } from "../Games/types";
import { CHECKERS_MOVE_TYPES, CheckersBoard, CHECKERSMove } from "../Games/Checkers/types";
import React from "react";
import { IChatLog } from "../../types";
import {ISignedGameMove} from "../../types/arbiter";


export const XMTPChatLog: React.FC<XMTPChatLogPropsI> = ({ logData, isLoading }) => {
  let slicedLogData = logData.slice(0, 10);
  let prettyLogData = slicedLogData.map((gameMessage) => {
    console.log('message', gameMessage);
    let signedGameMove = gameMessage.messageType == "ISignedGameMove" && gameMessage.message as ISignedGameMove;

    if (!signedGameMove) {
      return gameMessage;
    }

    let oldState: IMyGameBoard<TTTMove | CHECKERSMove> | null = null;
    let newState: IMyGameBoard<TTTMove | CHECKERSMove> | null = null;
    let move: string | null;

    if (gameMessage.gameType == 'tic-tac-toe') {
      oldState = TicTacToeBoard.fromEncoded(signedGameMove.gameMove.oldState);
      newState = TicTacToeBoard.fromEncoded(signedGameMove.gameMove.newState);
      move = JSON.stringify(
        defaultAbiCoder.decode(TIC_TAC_TOE_MOVE_TYPES, signedGameMove.gameMove.move)
      );
    } else {
      oldState = CheckersBoard.fromEncoded(signedGameMove.gameMove.oldState);
      newState = CheckersBoard.fromEncoded(signedGameMove.gameMove.newState);
      move = JSON.stringify(
        defaultAbiCoder.decode(CHECKERS_MOVE_TYPES, signedGameMove.gameMove.move)
      );
    }
    return {
      signatures: signedGameMove.signatures,
      move: move,
      oldState: JSON.stringify(oldState),
      newState: JSON.stringify(newState),
    };
  }).filter(msg => msg != null) as IChatLog[];

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
