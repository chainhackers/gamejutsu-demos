import React, {useEffect, useState} from 'react';
import {Board} from 'components/Games/ET-Tic-Tac-Toe';
import {ITicTacToeProps} from './ITicTacToeProps';

import styles from './ET-Tic-Tac-Toe.module.scss';
import {TicTacToeBoard, TTTMove} from './types';

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
                        console.log(i);
                        if (gameState) {
                            !!gameState && setGameState(gameState.makeMove(TTTMove.fromMove(i, gameState.playerType)));
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
