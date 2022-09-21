import {ISignedGameMove} from '../../types/arbiter';


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

    makeMove(move: IMyGameMove): IGameState<IMyGameState, IMyGameMove> //TODO make signed move
}
