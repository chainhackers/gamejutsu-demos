import { TLastMove } from '../Checkers';
import { TCellData } from '../types';

export interface SquarePropsI {
    value: TCellData;
    onClick: () => void;
    disputable: boolean;
    selected: boolean;
    number?: number;
    flip?: boolean;
    onHandleMove: (undo: boolean, jump: boolean, passMove: boolean) => Promise<void>;
    lastMove?: TLastMove;
}
