import {XMTPChatLogElement} from 'components/XMTPChatLog/XMTPChatLogElement';
import {XMTPChatLogPropsI} from './XMTPChatLogProps';
import {defaultAbiCoder} from 'ethers/lib/utils';
import styles from './XMTPChatLog.module.scss';
import {TicTacToeBoard, TTTMove} from "../Games/ET-Tic-Tac-Toe/types";
import {IMyGameState} from "../Games/types";
import {CheckersBoard, CHECKERSMove} from "../Games/Checkers/types";
import React from "react";

export const XMTPChatLog: React.FC<XMTPChatLogPropsI> = ({gameType, logData, isLoading}) => {
    let slicedLogData = logData.slice(0, 3);
    let prettyLogData = slicedLogData.map((message) => {
        let signedGameMove = message.content && JSON.parse(message.content);
        let gameMove = signedGameMove?.gameMove;
        let _oldState = gameMove?.oldState;
        let _newState = gameMove?.newState;
        if (!_oldState || !_newState) {
            return message;
        }
        let oldState: IMyGameState<TTTMove | CHECKERSMove> | null = null;
        let newState: IMyGameState<TTTMove | CHECKERSMove> | null = null;

        if (gameType == 'tic-tac-toe') {
            oldState = TicTacToeBoard.fromEncoded(_oldState);
            newState = TicTacToeBoard.fromEncoded(_newState);
        } else {
            oldState = CheckersBoard.fromEncoded(_oldState);
            newState = CheckersBoard.fromEncoded(_newState);
        }
        const id = message.id.slice(0, 17) + '...' + message.id.slice(-17);

        return {
            id: id,
            sender: message.sender,
            recepient: message.recepient,
            timestamp: message.timestamp,
            signatures: signedGameMove.signatures,
            move: String(defaultAbiCoder.decode(['uint8'], gameMove.move)),
            oldState: JSON.stringify(oldState),
            newState: JSON.stringify(newState),
            content: message.content,
        };

        return {
            ...message,
            id,
            content: JSON.stringify({
                ...signedGameMove,
                gameMove: {
                    ...gameMove,
                    oldState,
                    newState,
                },
            }),
        };
    });
    return (
        <div className={styles.container}>
            <div className={styles.title}>XMTPChatLog</div>
            <div className={styles.loader}>{`Satus: ${
                prettyLogData.length === 0 ? 'Waiting...' : isLoading ? 'Fetching...' : 'Ready'
            }`}</div>
            <div className={styles.log}>
                {prettyLogData.map((log) => (
                    <XMTPChatLogElement key={log.id} {...log} />
                ))}
            </div>
        </div>
    );
};
