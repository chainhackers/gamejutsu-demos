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
                selected ? styles.selected : null
                )}
            onClick={onClick}
        >
            {value}
        </div>
    );
};
