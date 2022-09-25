import React from 'react';
import {Board} from 'components/Games/Checkers';
import {ICheckersProps} from './ICheckersProps';

import styles from './Checkers.module.scss';
import {decodeEncodedBoardState, getWinnerFromEncodedState, CheckersBoard, TPlayer, CHECKERSMove} from './types';
import { getRulesContract, transition } from 'gameApi';
import { ContractMethodNoResultError } from 'wagmi';

export const Checkers: React.FC<ICheckersProps> = ({
                                                           gameState,
                                                           getSignerAddress,
                                                           sendSignedMove
                                                       }) => {
    const boardState = gameState?.myGameState || CheckersBoard.empty()
    console.log('boardState', boardState);

    const clickHandler = async (i: number) => {
        if (!gameState) return;

        //TODO here
        const move: CHECKERSMove = CHECKERSMove.fromMove([i+2, i, false, false], gameState.playerType)

        getSignerAddress().then((address) => {
            return transition(getRulesContract('checkers'), 
                gameState.toGameStateContractParams(),
                gameState.playerId,
                move.encodedMove
            ).then((transitionResult) => {
                let winner: TPlayer | null = getWinnerFromEncodedState(transitionResult.state);
                const signedMove = gameState.signMove(move, address, winner)
                console.log({signedMove, move});
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
                    disputableMoves={boardState.disputableMoves}
                />
            </div>
        </div>
    );
};


