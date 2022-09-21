import React, {useEffect, useState} from 'react';
import {Board} from 'components/Games/ET-Tic-Tac-Toe';
import {ITicTacToeProps} from './ITicTacToeProps';

import styles from './ET-Tic-Tac-Toe.module.scss';
import {TicTacToeBoard, TTTMove} from './types';
import {_isValidSignedMove, getArbiter, getSigner, isValidSignedMove} from "../../../gameApi";

export const ETTicTacToe: React.FC<ITicTacToeProps> = ({
                                                           gameState,
                                                           onGameStateChange,
                                                           setGameState,
                                                       }) => {
    const boardState = gameState?.myGameState || TicTacToeBoard.empty()

    return (
        <div className={styles.container}>
            <p>E.T. TTT</p>

            <div className={styles.boardPanel}>
                <Board
                    squares={boardState.cells}
                    onClick={(i) => {
                        if (gameState) {
                            const move: TTTMove = TTTMove.fromMove(i, gameState.playerType)
                            getSigner().getAddress().then((address) => {
                                const signedMove = gameState.signMove(move, address)
                                console.log({signedMove, move});
                                setGameState(gameState.makeMove(move));
                                return signedMove
                            }).then((signedMove) => { //TODO remove
                                _isValidSignedMove(getArbiter(), signedMove).then((isValid) => {
                                    console.log({signedMove, isValid});
                                });

                            });
                        }
                    }
                    }
                    isFinished={!gameState || gameState?.isFinished}
                    disputableMoves={boardState.disputableMoves}
                />
            </div>
        </div>
    );
};
