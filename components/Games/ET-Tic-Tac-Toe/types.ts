import {IGameState, IMyGameMove, IMyGameState, TGameHistory, TGameStateContractParams} from "../types";
import {GameMove, IGameMove, ISignedGameMove, SignedGameMove} from "../../../types/arbiter";
import {defaultAbiCoder} from 'ethers/lib/utils';
import {signMoveWithAddress} from "../../../helpers/session_signatures";


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
    winner = null; //TODO: implement
    gameId: number;
    isMyTurn: boolean;
    myGameState: TicTacToeBoard;
    playerType: TPlayer;
    playerId: number;
    nonce: number = 0;

    constructor(gameId: number, playerType: TPlayer, board: TicTacToeBoard | null = null) {
        this.gameId = gameId;
        this.isMyTurn = playerType === 'X';
        this.myGameState = board || TicTacToeBoard.empty();
        this.playerType = playerType;
        this.playerId = playerType === 'X' ? 0 : 1;
    }

    makeMove(move: TTTMove, valid: boolean = true): TicTacToeState {
        const nextState = new TicTacToeState(this.gameId, this.playerType);
        nextState.nonce = this.nonce + 1;
        nextState.decodedMovesHistory = [...this.decodedMovesHistory, move];
        const nextDisputableMoveNonces = new Set(this.disputableMoveNumbers);

        if (!valid) {
            nextDisputableMoveNonces.add(this.nonce);
        }

        nextState.disputableMoveNumbers = nextDisputableMoveNonces;
        nextState.myGameState = TicTacToeBoard.fromHistory(nextState.decodedMovesHistory, nextState.disputableMoveNumbers);
        return Object.seal(nextState);
    }

    encodedMove(encodedMove: string, valid: boolean = true): TicTacToeState {
        const move = TTTMove.fromEncoded(encodedMove, this.playerId == 0 ? 'X' : 'O');
        return this.makeMove(move, valid)
    }

    opponentMove(encodedMove: string, valid: boolean = true): TicTacToeState {
        const move = TTTMove.fromEncoded(encodedMove, this.playerId == 0 ? 'O' : 'X'); //TODO reversed, remove hack
        return this.makeMove(move, valid)
    }

    //TODO deduplicate
    composeMove(move: TTTMove, playerAddress: string): IGameMove {
        return new GameMove(
            this.gameId,
            this.nonce,
            playerAddress,
            this.encode(),
            this.makeMove(move).encode(),
            move.encodedMove,
        )
    }


    async signMove(move: TTTMove, playerAddress: string): Promise<ISignedGameMove> {
        const gameMove = new GameMove(
            this.gameId,
            this.nonce,
            playerAddress,
            this.encode(),
            this.makeMove(move).encode(),
            move.encodedMove,
        )
        const signature = await signMoveWithAddress(gameMove, playerAddress);
        return new SignedGameMove(gameMove, [signature]);
    }

    toGameStateContractParams(): TGameStateContractParams {
        return { gameId: this.gameId, nonce: this.nonce, state: this.encode()}
    }

    private encode(): string {
        const xWins = this.winner === 'X';
        const oWins = this.winner === 'O';
        const cellsToEncode = this.myGameState.cells.map((cell) => {
            if (cell === null) {
                return 0;
            } else if (cell === 'X') {
                return 1;
            } else {
                return 2;
            }
        });
        return defaultAbiCoder.encode(STATE_TYPES, [cellsToEncode, xWins, oWins]);
    }
}
