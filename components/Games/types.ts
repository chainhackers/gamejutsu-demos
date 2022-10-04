import {IGameMove, ISignedGameMove} from '../../types/arbiter';

export type TPlayer = 'X' | 'O';
export type TGameHistory = ISignedGameMove[]

export interface IMyGameMove {
    encodedMove: string;
}

export interface IMyGameBoard<IMyGameMove> {
    getWinner(): TPlayer | null;
}

/**
 * Game state
 * 2 players only to make it doable during the hackathon
 *
 */

export type TContractGameState = {
    gameId: number,
    nonce: number,
    state: string
}

export interface IGameState<IMyGameBoard, IMyGameMove> {
    gameId: number;
    playerId: number;
    movesHistory: TGameHistory;
    disputableMoveNonces: Set<number>;
    lastMove: ISignedGameMove | null;
    lastOpponentMove: ISignedGameMove | null;
    redMoves: boolean;
    currentBoard: IMyGameBoard;
    isFinished: boolean;
    winner: number | null;
    nonce: number

    makeNewGameState(contractGameState: TContractGameState, move: IMyGameMove, valid: boolean, winner: TPlayer | null ): IGameState<IMyGameBoard, IMyGameMove>
    composeMove(contractGameState: TContractGameState,
        move: IMyGameMove,
        valid: boolean,
        winner: TPlayer | null, playerAddress:string): IGameMove;
    signMove(contractGameState: TContractGameState,
        move: IMyGameMove,
        valid: boolean,
        winner: TPlayer | null, playerAddress:string): Promise<ISignedGameMove>;
    toGameStateContractParams() : TContractGameState
    makeNewGameStateFromSignedMove(signedMove:ISignedGameMove, valid: boolean): IGameState<IMyGameBoard, IMyGameMove>
    makeNewGameStateFromOpponentsSignedMove(signedMove:ISignedGameMove, valid: boolean): IGameState<IMyGameBoard, IMyGameMove>
}
