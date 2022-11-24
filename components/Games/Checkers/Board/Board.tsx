import cn from 'classnames';
import {Square} from 'components/Games/Checkers';
import {IBoardProps} from './BoardProps';
import styles from './Board.module.scss';
import React from "react";

export const Board: React.FC<IBoardProps> = ({
                                                 squares,
                                                 onClick,
                                                 isFinished,
                                                 disputableMoves,
                                                 lastMove,
                                                 selectedCell,
                                                 flip,
                                                 onHandleMove,
                                             }) => { 
    console.log('lastMove board', lastMove);                                                   
    const renderSquare = (row: number, i: number) => {
        if (row % 2 == 1) {
            return <>
                <Square
                value={squares[i]}
                onClick={() => {onClick(i)}}
                disputable={disputableMoves.has(i)}
                selected={selectedCell == i || lastMove?.to == i || lastMove?.from == i}
                number={i}    
                flip={flip}
                onHandleMove={onHandleMove}
                lastMove={lastMove}
                />
                <Square
                value={null}
                onClick={() => {}}
                disputable={false}
                selected={false}
                flip={flip}
                onHandleMove={onHandleMove}
                />
                
            </>
        } 
        return <>
                <Square
                value={null}
                onClick={() => {}}
                disputable={false}
                selected={false}
                flip={flip}
                onHandleMove={onHandleMove}
                />
                <Square
                value={squares[i]}
                onClick={() => {onClick(i)}}
                disputable={disputableMoves.has(i)}
                selected={selectedCell == i || lastMove?.to == i || lastMove?.from == i}
                number={i}
                flip={flip}
                onHandleMove={onHandleMove}
                lastMove={lastMove}
                />
            </>
        
    };

    const getRow = (row: number) => {
        return (<div className={styles.boardRow}>
            {renderSquare(row, (row * 4) + 0)}
            {renderSquare(row, (row * 4) + 1)}
            {renderSquare(row, (row * 4) + 2)}
            {renderSquare(row, (row * 4) + 3)}
        </div>)
    }
    return (
        <div className={cn(styles.container, isFinished ? styles.finished : null)}>
            <div className={styles.boardCells}>
                {getRow(0)}
                {getRow(1)}
                {getRow(2)}
                {getRow(3)}
                {getRow(4)}
                {getRow(5)}
                {getRow(6)}
                {getRow(7)}
            </div>
        </div>
    );
};
