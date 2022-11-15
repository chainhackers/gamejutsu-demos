import cn from 'classnames';

import {SquarePropsI} from './SquareProps';
import styles from './Square.module.scss';
import React from "react";


export const Square: React.FC<SquarePropsI> = (
    {value, selected, onClick, disputable, number}
) => {
    // console.log('Square disputable: ', disputable);
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
            <span style={{
                fontSize: '14px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
                }}>
                {value}
            </span>
            <span style={{
                fontSize: '12px',
                position: 'absolute',
                color: 'lightgrey',
                transform: 'rotate(180deg)',
                left: '0',
                }}>
                {number}
            </span>
        </div>
    );
};
