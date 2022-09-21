import {IGameState, IMyGameMove, IMyGameState, TGameHistory} from "../types";
import {ISignedGameMove} from "../../../types/arbiter";
import {defaultAbiCoder} from 'ethers/lib/utils';


const STATE_TYPES = ['uint8[9]', 'bool', 'bool'] as const;
const MOVE_TYPES = ['uint8'] as const;

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

export class TTTMove implements IMyGameMove {
    encodedMove: string;
    move: number;
    player: TPlayer

    private constructor(encodedMove: string, player: TPlayer) {
        this.encodedMove = encodedMove;
        const m = defaultAbiCoder.decode(MOVE_TYPES, encodedMove) as [number];
        this.move = m[0];
        this.player = player;
    }

    static fromEncoded(encodedMove: string, player: TPlayer): TTTMove {
        return Object.seal(new TTTMove(encodedMove, player));
    }

    static fromMove(move: number, player: TPlayer): TTTMove {
        const encodedMove = defaultAbiCoder.encode(MOVE_TYPES, [move]);
        return Object.seal(new TTTMove(encodedMove, player));
    }
}

export class TicTacToeBoard implements IMyGameState<TTTMove> {
    cells: TCells;
    disputableMoves: Set<number>;

    private constructor(history: TTTMove[] = [], disputableMoveNonces: Set<number> = new Set()) {
        this.cells = [null, null, null, null, null, null, null, null, null];

        history.forEach((move) => {
            this.cells[move.move] = move.player;
        });

        this.disputableMoves = history.reduce<Set<number>>((acc: Set<number>, move: TTTMove, i) => {
            if (disputableMoveNonces.has(i)) {
                return acc.add(move.move);
            }
            return acc;
        }, new Set())
    }

    static fromHistory(history: TTTMove[], disputableMoveNonces: Set<number>): TicTacToeBoard {
        return Object.seal(new TicTacToeBoard(history, disputableMoveNonces));
    }

    static empty(): TicTacToeBoard {
        return Object.seal(new TicTacToeBoard());
    }
}

export class TicTacToeState implements IGameState<TicTacToeBoard, TTTMove> {
    movesHistory: TGameHistory = [];
    decodedMovesHistory: TTTMove[] = [];
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
        this.myGameState = board || TicTacToeBoard.empty();
        this.playerType = playerType;
        this.playerId = playerType === 'X' ? 0 : 1;
    }

    makeMove(move: TTTMove): TicTacToeState {
        const nextState = new TicTacToeState(this.gameId, this.playerType);
        nextState.nonce = this.nonce + 1;
        nextState.decodedMovesHistory = [...this.decodedMovesHistory, move];
        const nextDisputableMoveNonces = new Set(this.disputableMoveNumbers);
        if (this.nonce % 2 === 0) {
            nextDisputableMoveNonces.add(nextState.nonce);
        }
        nextState.disputableMoveNumbers = nextDisputableMoveNonces;
        nextState.myGameState = TicTacToeBoard.fromHistory(nextState.decodedMovesHistory, nextState.disputableMoveNumbers);
        return Object.seal(nextState);
    }
}