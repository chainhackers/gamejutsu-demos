import {TicTacToeBoard, TicTacToeState, TTTMove} from './types';
import {Dispatch, SetStateAction} from "react";
import {IGameState} from "../types";
import {ISignedGameMove} from "../../../types/arbiter";

export interface ITicTacToeProps {
    gameState?: TicTacToeState;
    // onGameStateChange?: (gameState: IGameState<TicTacToeBoard, TTTMove>, move: number) => void;
    // setGameState: Dispatch<SetStateAction<TicTacToeState>>;
    // verifyMove:
    // verifySignedMove:

    // arbiter:


    getSignerAddress: () => Promise<string>;
    sendSignedMove: (move: ISignedGameMove) => void;
}
