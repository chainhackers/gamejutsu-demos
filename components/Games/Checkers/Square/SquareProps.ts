import { TCellData } from '../types';

export interface SquarePropsI {
    value: TCellData;
    onClick: () => void;
    disputable: boolean;
    selected: boolean;
    number?: number;
    flip?: boolean;
}
