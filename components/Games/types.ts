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

export type TGameStateContractParams = {
    gameId: number,
    nonce: number,
    state: string
}

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
    nonce: number

    makeMove(move: IMyGameMove): IGameState<IMyGameState, IMyGameMove>
    //todo makeSignedMove(signedMove: ISignedGameMove): IGameState<IMyGameState, IMyGameMove>
    composeMove(move: IMyGameMove, playerAddress: string): IGameMove
    toGameStateContractParams() : TGameStateContractParams
}

// export interface IGameProps {
//
// }