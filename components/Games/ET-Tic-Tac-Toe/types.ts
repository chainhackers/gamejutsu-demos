import {IGameState, IMyGameState, TGameHistory} from "../types";
import {ISignedGameMove} from "../../../types/arbiter";


export type TPlayer = 'X' | 'O';
export type TCellData = null | TPlayer;
export type TCells = [
    TCellData,
    TCellData,
    TCellData,
    TCellData,
    TCellData,
    TCellData,
    TCellData,
    TCellData,
    TCellData,
];

export class TicTacToeBoard implements IMyGameState {
    cells: TCells;

    constructor(data: TCells | null = null) {
        if (data) {
            this.cells = [...data];
        } else {
            this.cells = [null, null, null, null, null, null, null, null, null];
        }
    }

    //
    // idByPlayerType(playerType: TPlayer): number {
    //     return playerType === 'X' ? 1 : 2;
    // }
}

export interface ITicTacToeState extends IGameState<TicTacToeBoard> {
}

export class TicTacToeState implements ITicTacToeState {
    movesHistory: TGameHistory = [];
    disputableMoveNumbers: Set<number> = new Set();
    lastMove: ISignedGameMove | null = null;
    lastOpponentMove: ISignedGameMove | null = null;
    isFinished: boolean = false;

    gameId: number;
    isMyTurn: boolean;
    myGameState: TicTacToeBoard;
    playerType: TPlayer;
    playerId: number;
    nonce: number = 0; //TODO implement

    constructor(gameId: number, playerType: TPlayer, board: TicTacToeBoard | null = null) {
        this.gameId = gameId;
        this.isMyTurn = playerType === 'X';
        this.myGameState = board || new TicTacToeBoard();
        this.playerType = playerType;
        this.playerId = playerType === 'X' ? 0 : 1;
    }

    makeMove(move: number): TicTacToeState {
        const newBoard = new TicTacToeBoard(this.myGameState.cells);
        newBoard.cells[move] = this.playerType;

        const nextState = new TicTacToeState(this.gameId, this.playerType, newBoard);
        const nextDisputableMoves = new Set(this.disputableMoveNumbers);
        if (this.nonce % 2 === 0) {
            nextDisputableMoves.add(move);
        }
        nextState.disputableMoveNumbers = nextDisputableMoves;
        nextState.nonce = this.nonce + 1;
        console.log('makeMove', nextState);
        return Object.seal(nextState);
    }
}
