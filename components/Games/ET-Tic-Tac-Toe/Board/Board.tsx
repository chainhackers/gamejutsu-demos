import cn from 'classnames';
import {Square} from 'components/Games/ET-Tic-Tac-Toe';
import {IBoardProps} from './BoardProps';
import styles from './Board.module.scss';
import React from "react";

export const Board: React.FC<IBoardProps> = ({
                                                 squares,
                                                 onClick,
                                                 isFinished,
                                                 disputableMoves,
                                             }) => {
    const renderSquare = (i: number) => {
        return <Square
            value={squares[i]}
            onClick={() => onClick(i)}
            disputable={disputableMoves.has(i)}/>
    };
    return (
        <div className={cn(styles.container, isFinished ? styles.finished : null)}>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
};
