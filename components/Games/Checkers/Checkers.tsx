import React, { useState } from 'react';
import { Board } from 'components/Games/Checkers';
import { ICheckersProps } from './ICheckersProps';

import styles from './Checkers.module.scss';
import { CheckersBoard, CHECKERSMove } from './types';
import { getRulesContract, transition } from 'gameApi';
import { Button } from 'components/shared';
import { t } from 'i18next';
import cn from 'classnames';
import { isJumpMove } from 'helpers/utils';
export type TLastMove = {
    from: number;
    to: number;
} | null;

export const Checkers: React.FC<ICheckersProps> = ({
    gameState,
    getSignerAddress,
    sendSignedMove,
    playerIngameId,
}) => {

    const [selectedCell, setSelectedCell] = useState<number | null>(null);
    


    const [lastMove, setLastMove] = useState<TLastMove>(null);

    const boardState = gameState?.currentBoard || CheckersBoard.empty();


    async function onButtonClickHandler(undo: boolean, jump: boolean, passMove: boolean): Promise<void> {
        if (undo) {
            setLastMove(null);
            return;
        }
        if (!lastMove) {
            return;
        }
        if (!gameState) {
            return;
        }

        const move: CHECKERSMove = CHECKERSMove.fromMove([lastMove.from, lastMove.to, jump, passMove], gameState.playerType);
        console.log('move', lastMove.from, lastMove.to, jump, passMove);
        setLastMove(null);

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

    const clickHandler = async (i: number) => {
        if (!gameState) {
            return;
        }
        if (lastMove) {
            return;
        }
        if (selectedCell == null) {
            setSelectedCell(i);
            return;
        }
        setLastMove({ from: selectedCell, to: i });
        setSelectedCell(null);
    }

    function makeButton(title: string, style: string, undo: boolean, jump: boolean, passMove: boolean) {
        return <div className={styles[style]}>
            <Button
                borderless
                color='black'
                size="sm"
                title={title}
                onClick={() => {
                    onButtonClickHandler(undo, jump, passMove);
                }}
            />
        </div>
    }

    return (
        <div className={styles.container}>
            <div style = {playerIngameId === 0 ? {transform:'rotate(180deg)', display:'inherit'}: {display:'inherit'}}>
                <Board 
                    squares={boardState.cells}
                    onClick={clickHandler}
                    isFinished={!gameState || gameState?.isFinished}
                    selectedCell={selectedCell}
                    disputableMoves={boardState.disputableMoves}
                    lastMove={lastMove}
                    flip={playerIngameId === 0}
                    onHandleMove={onButtonClickHandler}
                    
                />
            </div>
        </div>
);
};
