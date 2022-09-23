import React from 'react';
import { Board } from 'components/Games/ET-Tic-Tac-Toe';
import { ITicTacToeProps } from './ITicTacToeProps';

import styles from './ET-Tic-Tac-Toe.module.scss';
import { TicTacToeBoard, TTTMove } from './types';
import { GameField, NewGameBoard } from 'components';

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
        const signedMove = gameState.signMove(move, address);
        console.log({ signedMove, move });
        return signedMove;
      })
      .then(sendSignedMove)
      .catch(console.error);
  };

  return (
    <div className={styles.container}>
      <Board
        squares={boardState.cells}
        onClick={clickHandler}
        isFinished={!gameState || gameState?.isFinished}
        disputableMoves={boardState.disputableMoves}
      />
    </div>
  );
};
