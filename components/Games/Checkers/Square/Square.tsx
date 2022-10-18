import cn from 'classnames';

import {SquarePropsI} from './SquareProps';
import styles from './Square.module.scss';
import React from "react";


export const Square: React.FC<SquarePropsI> = (
    {value, selected, onClick, disputable}
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
        </div>
    );
};
