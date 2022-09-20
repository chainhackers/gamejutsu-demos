import React, {useEffect, useState} from 'react';
import {useAccount, useConnect, useDisconnect} from 'wagmi';
import {useQuery} from '@apollo/client';

import {Board} from 'components/Games/ET-Tic-Tac-Toe';
import gameApi from 'gameApi';
import {ITicTacToeProps} from './ITicTacToeProps';

import {defaultAbiCoder} from 'ethers/lib/utils';
import rulesContract from 'contracts/TicTacToeRules.json';
import styles from './ET-Tic-Tac-Toe.module.scss';
import {TCellData, TicTacToeBoard, ITicTacToeState} from './types';

import {signMove, getSessionWallet} from 'helpers/session_signatures';
import {ethers} from 'ethers';


import {gameEntitiesQuery, inRowCounterEntitiesQuery} from 'queries';

export const ETTicTacToe: React.FC<ITicTacToeProps> = ({
                                                           gameState,
                                                           onGameStateChange,
                                                           setGameState,
                                                       }) => {
    const [boardState, setBoardState] = useState<TicTacToeBoard>(gameState?.myGameState || new TicTacToeBoard());

    return (
        <div className={styles.container}>
            <p>E.T. TTT</p>

            <div className={styles.boardPanel}>
                <Board
                    squares={boardState.cells}
                    onClick={(i) => {
                        console.log(i);
                        !!gameState && setGameState(gameState.makeMove(i));
                    }
                    }
                    isFinished={!gameState || gameState?.isFinished}
                    disputableMoves={gameState?.disputableMoveNumbers || new Set()}
                />
            </div>
        </div>
    );
};
