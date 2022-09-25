import {CheckersBoard, CheckersState, CHECKERSMove} from './types';
import {Dispatch, SetStateAction} from "react";
import {IGameState} from "../types";
import {ISignedGameMove} from "../../../types/arbiter";

export interface ICheckersProps {
    gameState?: CheckersState;
    // onGameStateChange?: (gameState: IGameState<CheckersBoard, CHECKERSMove>, move: number) => void;
    // setGameState: Dispatch<SetStateAction<CheckersState>>;
    // verifyMove:
    // verifySignedMove:

    // arbiter:


    getSignerAddress: () => Promise<string>;
    sendSignedMove: (move: ISignedGameMove) => void;
}
