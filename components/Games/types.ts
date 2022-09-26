import {IGameMove, ISignedGameMove} from '../../types/arbiter';
import {TTTMove} from "./ET-Tic-Tac-Toe/types";

export type TPlayer = 'X' | 'O';
export type TGameHistory = ISignedGameMove[]

export interface IMyGameMove {
    encodedMove: string;
}

export interface IMyGameState<IMyGameMove> {
    getWinner(): TPlayer | null;
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
    redMoves: boolean;
    myGameState: IMyGameState;
    isFinished: boolean;
    winner: number | null;
    nonce: number

    makeMove(move: IMyGameMove, valid: boolean, winner: TPlayer | null ): IGameState<IMyGameState, IMyGameMove>
    //todo makeSignedMove(signedMove: ISignedGameMove): IGameState<IMyGameState, IMyGameMove>
    composeMove(move: IMyGameMove, playerAddress: string, winner: TPlayer | null): IGameMove
    toGameStateContractParams() : TGameStateContractParams
    encodedSignedMove(signedMove:ISignedGameMove, valid: boolean): IGameState<IMyGameState, IMyGameMove>
    opponentSignedMove(signedMove:ISignedGameMove, valid: boolean): IGameState<IMyGameState, IMyGameMove>
}

// export interface IGameProps {
//
// }