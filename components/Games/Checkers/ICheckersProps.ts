import {CheckersBoard, CheckersState, CHECKERSMove} from './types';
import {Dispatch, SetStateAction} from "react";
import {IGameState} from "../types";
import {ISignedGameMove} from "../../../types/arbiter";

export interface ICheckersProps {
    gameState?: CheckersState;
    getSignerAddress: () => Promise<string>;
    sendSignedMove: (move: ISignedGameMove) => void;
    playerIngameId: 0 | 1;
}
