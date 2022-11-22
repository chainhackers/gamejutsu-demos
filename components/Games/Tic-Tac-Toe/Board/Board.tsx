import cn from 'classnames';
import { Square } from 'components/Games/Tic-Tac-Toe';
import { NewSquare } from '../NewSquare';
import { IBoardProps } from './BoardProps';
import styles from './Board.module.scss';
import React from 'react';

export const Board: React.FC<IBoardProps> = ({
  squares,
  onClick,
  isFinished,
  disputableMoves,
}) => {
  const renderSquare = (i: number) => {
    return (
      <NewSquare
        value={squares[i]}
        onClick={() => onClick(i)}
        disputable={disputableMoves.has(i)}
      />
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className={styles.row}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className={styles.row}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};
