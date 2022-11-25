import { TLastMove } from "../Checkers";
import {TCellData, TCheckersContractMove} from "../types";

export interface IBoardProps {
    squares: TCellData[];
    onClick: (i: number) => void;
    isFinished: boolean;
    disputableMoves: Set<number>;
    lastMove: TLastMove;
    selectedCell: number | null;
    flip?: boolean;
    onHandleMove: (undo: boolean, jump: boolean, passMove: boolean) => Promise<void>;
}
