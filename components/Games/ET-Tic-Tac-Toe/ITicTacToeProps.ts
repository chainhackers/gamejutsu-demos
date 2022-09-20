import {ITicTacToeState} from './types';
import {Dispatch, SetStateAction} from "react";

export interface ITicTacToeProps {
    gameState?: ITicTacToeState;
    onGameStateChange?: (gameState: ITicTacToeState, move: number) => void;
    setGameState: Dispatch<SetStateAction<ITicTacToeState>>;
}
