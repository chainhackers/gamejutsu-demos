import cn from 'classnames';

import { isJumpMove } from 'helpers/utils';
import {SquarePropsI} from './SquareProps';
import styles from './Square.module.scss';
import React from "react";


export const Square: React.FC<SquarePropsI> = (
    {value, selected, onClick, disputable, number, flip, lastMove, onHandleMove}
) => {
    const controlButtonClickHandler = (undo: boolean, jump: boolean, passMove: boolean): React.MouseEventHandler<HTMLDivElement> => (event) => {
        event.stopPropagation();
        onHandleMove(undo, jump, passMove)
    };

    const isJump = !!lastMove ? isJumpMove(lastMove) : false;

    return (
        <div
            className={cn(
                styles.square,
                disputable ? styles.disputable : null,
                selected ? styles.selected : null,
                value == 'X' ? styles.white : null,
                value == 'O' ? styles.red: null,
                value == 'XX' ? styles.whiteQueen : null,
                value == 'OO' ? styles.redQueen : null,
                )}
            onClick={onClick}
        >
            {lastMove && lastMove.to === number && !!selected && <div className={cn(styles.controls, flip ? styles.flip : null)}>
                <div className={styles.row}>
                    <div className={cn(styles.button, styles.undo)} onClick={controlButtonClickHandler(true, false, false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                            <line x1="200" y1="56" x2="56" y2="200" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40"></line>
                            <line x1="200" y1="200" x2="56" y2="56" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40"></line>
                        </svg>
                    </div>
                    <div className={cn(styles.button, styles.confirm)} onClick={controlButtonClickHandler(false, isJump, true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                            <polyline points="176 152 224 104 176 56" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40"></polyline>
                            <path d="M32,200a96,96,0,0,1,96-96h96" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40"></path>
                        </svg>
                    </div>
                </div>
                <div className={styles.row} onClick={controlButtonClickHandler(false, true, false)}>
                    {isJump && <div className={cn(styles.button, styles.jump)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                            <polyline points="163.9 148.1 227.9 148.1 227.9 84.1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40"></polyline>
                            <path d="M32,184a96,96,0,0,1,163.9-67.9l32,32" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40"></path>
                        </svg>
                    </div>}
                </div>
                
                
            </div>}
            <span style={{
                fontSize: '12px',
                position: 'absolute',
                color: 'lightgrey',
                transform: `rotate(${flip ? '180deg': '0deg'})`,
                left: '0',
                }}>
                {number}
            </span>
        </div>
    );
};
