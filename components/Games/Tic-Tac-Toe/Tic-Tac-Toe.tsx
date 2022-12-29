import React from 'react';
import { Board } from 'components/Games/Tic-Tac-Toe';
import { ITicTacToeProps } from './ITicTacToeProps';

import styles from './Tic-Tac-Toe.module.scss';
import {
  TicTacToeBoard,
  TTTMove,
} from './types';
import { getRulesContract, transition } from 'gameApi';

export const TicTacToe: React.FC<ITicTacToeProps> = ({
  gameState,
  getSignerAddress,
  sendSignedMove,
}) => {
  const boardState = gameState?.currentBoard || TicTacToeBoard.empty();

  const clickHandler = async (i: number) => {
    if (!gameState) return;
    
    const move: TTTMove = TTTMove.fromMove(i, gameState.playerType);
    console.log('Tic-Tac-Toe clickHandler: i = ', i);
    console.log('Tic-Tac-Toe clickHandler: playerType = ', gameState.playerType);
    console.log('Tic-Tac-Toe clickHandler: move = ', move);


    let address = await getSignerAddress();
    console.log('Tic-Tac-Toe clickHandler: address = ', address);
    let transitionResult = await transition(await getRulesContract('tic-tac-toe'),
      gameState.toGameStateContractParams(),
      gameState.playerId,
      move.encodedMove
    );
    console.log('Tic-Tac-Toe clickHandler: transitionResult = ', transitionResult);
    const signedMove = await gameState.signMove(
      gameState.composeMove(move, transitionResult, true, address),
      address);
    console.log('Tic-Tac-Toe clickHandler: signedMove = ', signedMove);
    sendSignedMove(signedMove);
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
