import React, { useState } from 'react';
import { Board } from 'components/Games/Checkers';
import { ICheckersProps } from './ICheckersProps';

import styles from './Checkers.module.scss';
import { CheckersBoard, CHECKERSMove } from './types';
import { getRulesContract, transition } from 'gameApi';

export const Checkers: React.FC<ICheckersProps> = ({
    gameState,
    getSignerAddress,
    sendSignedMove
}) => {

    const [selectedCell, setSelectedCell] = useState<number | null>(null);

    const boardState = gameState?.currentBoard || CheckersBoard.empty()

    //TODO here
    const clickHandler = async (i: number) => {
        if (!gameState) return;

        if (!selectedCell) {
            setSelectedCell(i);
            return;
        }

        setSelectedCell(null);

        function isJump(oldPosition: number, newPosition: number): boolean {
            function getRow(position: number) { return position % 4; }
            function getColumn(position: number) { return Math.floor(position / 4); }
            function distance(x: number, y: number) { return Math.abs(x - y); }
            return distance(getRow(oldPosition), getRow(newPosition)) > 1 ||
                distance(getColumn(oldPosition), getColumn(newPosition)) > 1
        }

        let _isJump = isJump(selectedCell, i);
        //TODO here !!!it's only log setting in next line
        console.log('move', [selectedCell + 1, i + 1, _isJump, !_isJump]);
        const move: CHECKERSMove = CHECKERSMove.fromMove([selectedCell, i, _isJump, !_isJump], gameState.playerType)

        let address = await getSignerAddress();
        let transitionResult = await transition(getRulesContract('checkers'),
            gameState.toGameStateContractParams(),
            gameState.playerId,
            move.encodedMove
        );
        const signedMove = await gameState.signMove(
                    gameState.composeMove(move, transitionResult, true, address),
                    address);
        sendSignedMove(signedMove);
    }

return (
    <div className={styles.container}>
        <div className={styles.boardPanel}>
            <Board
                squares={boardState.cells}
                onClick={clickHandler}
                isFinished={!gameState || gameState?.isFinished}
                selectedCell={selectedCell}
                disputableMoves={boardState.disputableMoves}
            />
        </div>
    </div>
);
};


