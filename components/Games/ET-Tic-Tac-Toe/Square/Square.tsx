import cn from 'classnames';

import {SquarePropsI} from './SquareProps';
import styles from './Square.module.scss';
import React from "react";


export const Square: React.FC<SquarePropsI> = (
    {value, onClick, disputable}
) => {
    console.log('Square disputable: ', disputable);
    return (
        <button
            className={cn(styles.square, disputable ? styles.disputable : null)}
            onClick={onClick}
        >
            {value}
        </button>
    );
};
