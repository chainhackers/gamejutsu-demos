import React, {useEffect, useState} from 'react';
import {Board} from 'components/Games/ET-Tic-Tac-Toe';
import {ITicTacToeProps} from './ITicTacToeProps';

import styles from './ET-Tic-Tac-Toe.module.scss';
import {TicTacToeBoard, TTTMove} from './types';
import {_isValidGameMove, _isValidSignedMove, getArbiter, getSigner, isValidSignedMove} from "../../../gameApi";

export const ETTicTacToe: React.FC<ITicTacToeProps> = ({
                                                           gameState,
                                                           onGameStateChange,
                                                           setGameState,
                                                           sendSignedMove
                                                       }) => {
    const boardState = gameState?.myGameState || TicTacToeBoard.empty()

    const clickHandler = async (i: number) => {
        if (!gameState) return;

        const move: TTTMove = TTTMove.fromMove(i, gameState.playerType)

        const signerAddress = await getSigner().getAddress(); //TODO check which signer is used
        const canidateMove = gameState.composeMove(move, signerAddress);
        const isValid = await _isValidGameMove(canidateMove)

        //TODO when invalid, show warning dialogue

        getSigner().getAddress().then((address) => {
            const signedMove = gameState.signMove(move, address)
            console.log({signedMove, move});
            setGameState(gameState.makeMove(move, isValid));
            return signedMove
        }).then((signedMove) => { //TODO remove
            _isValidSignedMove(getArbiter(), signedMove).then((isValid) => {
                if (!isValid) {
                    console.warn("You just sent an invalid move to your opponent!", signedMove);
                }
            });
            sendSignedMove(signedMove);
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.boardPanel}>
                <Board
                    squares={boardState.cells}
                    onClick={clickHandler}
                    isFinished={!gameState || gameState?.isFinished}
                    disputableMoves={boardState.disputableMoves}
                />
            </div>
        </div>
    );
};
