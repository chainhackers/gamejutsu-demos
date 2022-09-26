import React, { useState } from 'react';
import {Board} from 'components/Games/Checkers';
import {ICheckersProps} from './ICheckersProps';

import styles from './Checkers.module.scss';
import {CheckersBoard, CHECKERSMove} from './types';
import { getRulesContract, transition } from 'gameApi';
import {TPlayer} from "../types";

export const Checkers: React.FC<ICheckersProps> = ({
                                                           gameState,
                                                           getSignerAddress,
                                                           sendSignedMove
                                                       }) => {

    const [selectedCell, setSelectedCell] = useState<number| null>(null); 

    const boardState = gameState?.myGameState || CheckersBoard.empty()
    console.log('boardState', boardState);


    //TODO here
    const clickHandler = async (i: number) => {
        if (!gameState) return;

        if (!selectedCell) {
            setSelectedCell(i);
            return;
        }

        setSelectedCell(null);

        //TODO here
        console.log('move', [selectedCell, i, false, false]);
        const move: CHECKERSMove = CHECKERSMove.fromMove([selectedCell, i, false, false], gameState.playerType)

        getSignerAddress().then((address) => {
            return transition(getRulesContract('checkers'),
                gameState.toGameStateContractParams(),
                gameState.playerId,
                move.encodedMove
            ).then((transitionResult) => {
                let winner: TPlayer | null = CheckersBoard.fromEncoded(transitionResult.state).getWinner();
                const signedMove = gameState.signMove(move, address, winner)
                console.log({ signedMove, move });
                return signedMove
            });
        }).then(sendSignedMove)
            .catch(console.error)
    }

    return (
        <div className={styles.container}>
            <div className={styles.boardPanel}>
                <Board
                    squares={boardState.cells}
                    onClick={clickHandler}
                    isFinished={!gameState || gameState?.isFinished}
                    selectedCell = {selectedCell}
                    disputableMoves={boardState.disputableMoves}
                />
            </div>
        </div>
    );
};


