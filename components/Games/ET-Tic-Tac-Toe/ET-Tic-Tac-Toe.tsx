import React from 'react';
import { Board } from 'components/Games/ET-Tic-Tac-Toe';
import { ITicTacToeProps } from './ITicTacToeProps';

import styles from './ET-Tic-Tac-Toe.module.scss';
import {
  decodeEncodedBoardState,
  getWinnerFromEncodedState,
  TicTacToeBoard,
  TPlayer,
  TTTMove,
} from './types';
import { getRulesContract, transition } from 'gameApi';
import { ContractMethodNoResultError } from 'wagmi';

export const ETTicTacToe: React.FC<ITicTacToeProps> = ({
  gameState,
  getSignerAddress,
  sendSignedMove,
}) => {
  const boardState = gameState?.myGameState || TicTacToeBoard.empty();

  const clickHandler = async (i: number) => {
    if (!gameState) return;

    const move: TTTMove = TTTMove.fromMove(i, gameState.playerType);

    getSignerAddress()
      .then((address) => {
        return transition(
          getRulesContract('tic-tac-toe'),
          gameState.toGameStateContractParams(),
          gameState.playerId,
          move.encodedMove,
        ).then((transitionResult) => {
          let winner: TPlayer | null = getWinnerFromEncodedState(transitionResult.state);
          const signedMove = gameState.signMove(move, address, winner);
          console.log({ signedMove, move });
          return signedMove;
        });
      })
      .then(sendSignedMove)
      .catch(console.error);
  };

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
