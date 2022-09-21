import {IGameMove, ISignedGameMove} from '../../types/arbiter';
import {TTTMove} from "./ET-Tic-Tac-Toe/types";


export type TGameHistory = ISignedGameMove[]

export interface IMyGameMove {
    encodedMove: string;
}

export interface IMyGameState<IMyGameMove> {
}

/**
 * Game state
 * 2 players only to make it doable during the hackathon
 *
 */
export interface IGameState<IMyGameState, IMyGameMove> {
    gameId: number;
    playerId: number;
    movesHistory: TGameHistory;
    disputableMoveNumbers: Set<number>;
    lastMove: ISignedGameMove | null;
    lastOpponentMove: ISignedGameMove | null;
    isMyTurn: boolean;
    myGameState: IMyGameState;
    isFinished: boolean;
    winner: number | null;

    makeMove(move: IMyGameMove): IGameState<IMyGameState, IMyGameMove> //TODO make signed move
    composeMove(move: IMyGameMove, playerAddress: string): IGameMove
}

// export interface IGameProps {
//
// }