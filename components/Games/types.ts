import {ISignedGameMove} from '../../types/arbiter';


export type TGameHistory = ISignedGameMove[]

export interface IMyGameState {
}

/**
 * Game state
 * 2 players only to make it doable during the hackathon
 *
 */
export interface IGameState<IMyGameState> {
    gameId: number;
    playerId: number;
    movesHistory: TGameHistory;
    disputableMoveNumbers: Set<number>;
    lastMove: ISignedGameMove | null;
    lastOpponentMove: ISignedGameMove | null;
    isMyTurn: boolean;
    myGameState: IMyGameState;
    isFinished: boolean;
    makeMove(move: number): IGameState<IMyGameState> //TODO number -> Move type
}
