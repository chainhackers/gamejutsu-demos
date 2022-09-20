import {TCellData} from '../types';

export interface SquarePropsI {
    value: TCellData;
    onClick: () => void;
    disputable: boolean;
}
