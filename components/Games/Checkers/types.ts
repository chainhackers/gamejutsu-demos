import { IGameState, IMyGameMove, IMyGameBoard, TGameHistory, TContractGameState, TPlayer } from "../types";
import { GameMove, IGameMove, ISignedGameMove, SignedGameMove } from "../../../types/arbiter";
import { defaultAbiCoder } from 'ethers/lib/utils';
import { signMoveWithAddress } from "../../../helpers/session_signatures";
import { ChannelListener } from "diagnostics_channel";

export const CHECKERS_STATE_TYPES = ["uint8[32]", "bool", "uint8"]
export const CHECKERS_MOVE_TYPES = ["uint8", "uint8", "bool", "bool"]

export function decodeEncodedBoardState(encodedBoardState: string) {
    return defaultAbiCoder.decode(CHECKERS_STATE_TYPES, encodedBoardState);
}

// @custom cells 32-byte array of uint8s representing the board
// @custom redMoves says whether it is red's turn to move
// @custom winner is 0 for no winner, 1 for white, 2 for red
// @dev cells[i] values:
// @dev 0x01 is White
// @dev 0x02 is Red
// @dev 0xA1 is White King
// @dev 0xA2 is Red King

// struct State {
//     uint8[32] cells;
//     bool redMoves;
//     uint8 winner;
// }


// @custom from 1-based index of the cell to move from
//     @custom to 1-based index of the cell to move to
//     @custom isJump declares if the move is a jump
//     @custom passMoveToOpponent declares explicitly if the next move is to be done by the opponent

// struct Move {
//     uint8 from;
//     uint8 to;
//     bool isJump;
//     bool passMoveToOpponent;
// }

export type TCellData = null | TPlayer;
//32
export type TCells = [
    TCellData, TCellData, TCellData, TCellData,
    TCellData, TCellData, TCellData, TCellData,
    TCellData, TCellData, TCellData, TCellData,
    TCellData, TCellData, TCellData, TCellData,
    TCellData, TCellData, TCellData, TCellData,
    TCellData, TCellData, TCellData, TCellData,
    TCellData, TCellData, TCellData, TCellData,
    TCellData, TCellData, TCellData, TCellData,
];

export type TCheckersContractMove = [number, number, boolean, boolean];
export type TCheckersContractStateAkaBoard = [number[], boolean, number];

export class CHECKERSMove implements IMyGameMove {
    encodedMove: string;
    from: number;
    to: number;
    isJump: boolean;
    passMoveToOpponent: boolean
    player: TPlayer

    private constructor(encodedMove: string, player: TPlayer) {
        this.encodedMove = encodedMove;
        let from, to;
        [from, to, this.isJump, this.passMoveToOpponent] = defaultAbiCoder.decode(CHECKERS_MOVE_TYPES, encodedMove);
        this.from = from - 1;
        this.to = to - 1;
        this.player = player;
    }

    static fromEncoded(encodedMove: string, player: TPlayer): CHECKERSMove {
        return Object.seal(new CHECKERSMove(encodedMove, player));
    }

    static fromMove([from, to, isJump, passMoveToOpponent]: TCheckersContractMove, player: TPlayer): CHECKERSMove {
        const encodedMove = defaultAbiCoder.encode(CHECKERS_MOVE_TYPES, [from + 1, to + 1, isJump, passMoveToOpponent]);
        return Object.seal(new CHECKERSMove(encodedMove, player));
    }
}

export class CheckersBoard implements IMyGameBoard<CHECKERSMove> {
    cells: TCells;
    winner: TPlayer | null = null;
    redMoves: boolean = true;
    disputableMoves: Set<number>;

    getWinner(): TPlayer | null {
        return this.winner;
    }

    private constructor(history: CHECKERSMove[] = [], disputableMoveNonces: Set<number> = new Set()) {
        this.cells = [
            'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X',
            'X', 'X', 'X', 'X', null, null, null, null,
            null, null, null, null, 'O', 'O', 'O', 'O',
            'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        ];

        history.forEach((move) => {
            this.cells[move.from] = null;
            this.cells[move.to] = move.player;
        });

        this.disputableMoves = history.reduce<Set<number>>((acc: Set<number>, move: CHECKERSMove, i) => {
            if (disputableMoveNonces.has(i)) {
                return acc.add(move.to);
            }
            return acc;
        }, new Set())
    }

    static fromEncoded(encodedBoardState: string): CheckersBoard {
        const [cells, redMoves, winner] = defaultAbiCoder.decode(CHECKERS_STATE_TYPES, encodedBoardState);
        const board = new CheckersBoard();
        board.cells = cells;
        board.redMoves = redMoves;
        if (winner == 1) {
            board.winner = 'X';
        } else if (winner == 2) {
            board.winner = 'O';
        }
        return Object.seal(board);
    }

    static fromHistory(history: CHECKERSMove[], disputableMoveNonces: Set<number>): CheckersBoard {
        return Object.seal(new CheckersBoard(history, disputableMoveNonces));
    }

    static empty(): CheckersBoard {
        let emtpyCheckersBoard = new CheckersBoard();
        return Object.seal(emtpyCheckersBoard)
    }
}


// struct State {
//     uint8[32] cells;
//     bool redMoves;
//     uint8 winner;
// }


export class CheckersState implements IGameState<CheckersBoard, CHECKERSMove> {
    movesHistory: TGameHistory = [];
    decodedMovesHistory: CHECKERSMove[] = [];
    disputableMoveNonces: Set<number> = new Set();
    //TODO set
    lastMove: ISignedGameMove | null = null;
    lastOpponentMove: ISignedGameMove | null = null;
    isFinished: boolean = false;
    winner: number | null = null;
    gameId: number;
    redMoves: boolean; //aka redMoves
    currentBoard: CheckersBoard;
    playerType: TPlayer;
    playerId: number;
    nonce: number = 0;

    constructor(gameId: number, playerType: TPlayer, board: CheckersBoard | null = null) {
        this.gameId = gameId;
        this.redMoves = true; //playerType === 'O';
        this.currentBoard = board || CheckersBoard.empty();
        this.playerType = playerType;
        this.playerId = playerType === 'X' ? 0 : 1;
    }

    static fromCheckersState(checkersState: CheckersState): CheckersState {
        const state = new CheckersState(checkersState.gameId, checkersState.playerType, checkersState.currentBoard);
        state.movesHistory = checkersState.movesHistory;
        state.decodedMovesHistory = checkersState.decodedMovesHistory;
        state.disputableMoveNonces = checkersState.disputableMoveNonces;
        state.lastMove = checkersState.lastMove;
        state.lastOpponentMove = checkersState.lastOpponentMove;
        state.isFinished = checkersState.isFinished;
        state.winner = checkersState.winner;
        state.nonce = checkersState.nonce;
        return state;
    }


    makeNewGameStateFromSignedMove(signedMove: ISignedGameMove, valid: boolean = true): CheckersState {
        const winner = CheckersBoard.fromEncoded(signedMove.gameMove.newEncodedGameBoard).winner;
        const move = CHECKERSMove.fromEncoded(signedMove.gameMove.encodedMove, this.playerId == 0 ? 'X' : 'O');
        return this.makeNewGameState({
            gameId: signedMove.gameMove.gameId,
            nonce: signedMove.gameMove.nonce,
            state: signedMove.gameMove.newEncodedGameBoard,
        }, move, valid, winner);
    }

    makeNewGameStateFromOpponentsSignedMove(signedMove: ISignedGameMove, valid: boolean = true): CheckersState {
        const winner = CheckersBoard.fromEncoded(signedMove.gameMove.newEncodedGameBoard).winner;
        const move = CHECKERSMove.fromEncoded(signedMove.gameMove.encodedMove, this.playerId == 0 ? 'O' : 'X');
        return this.makeNewGameState({
            gameId: signedMove.gameMove.gameId,
            nonce: signedMove.gameMove.nonce,
            state: signedMove.gameMove.newEncodedGameBoard,
        }, move, valid, winner);
    }

    makeNewGameState(contractGameState: TContractGameState, move: CHECKERSMove, valid: boolean, winner: TPlayer | null): CheckersState {
        const nextState = { ...this };

        nextState.gameId = contractGameState.gameId;
        nextState.nonce = contractGameState.nonce;
        nextState.currentBoard = CheckersBoard.fromEncoded(contractGameState.state);

        //TODO just make getter if need
        //this line only in checkers implementation
        nextState.redMoves = nextState.currentBoard.redMoves;

        //above enough
        if (winner) {
            if (winner == this.playerType) {
                nextState.winner = this.playerId;
            } else {
                nextState.winner = 1 - this.playerId;
            }
        }

        nextState.decodedMovesHistory = [...this.decodedMovesHistory, move];
        const nextDisputableMoveNonces = new Set(this.disputableMoveNonces);
        if (!valid) {
            nextDisputableMoveNonces.add(this.nonce);
        }
        nextState.disputableMoveNonces = nextDisputableMoveNonces;

        return Object.freeze(nextState);
    }

    composeMove(contractGameState: TContractGameState,
        move: CHECKERSMove,
        valid: boolean = true,
        winner: TPlayer | null = null, playerAddress: string): IGameMove {
        const gameMove = new GameMove(
            this.gameId,
            this.nonce,
            playerAddress,
            this.encode(),
            this.makeNewGameState(contractGameState, move, valid, winner).encode(),
            move.encodedMove,
        )
        return gameMove;
    }

    async signMove(
        contractGameState: TContractGameState,
        move: CHECKERSMove,
        valid: boolean = true,
        winner: TPlayer | null = null,
        playerAddress: string
    ): Promise<ISignedGameMove> {
        const gameMove = this.composeMove(contractGameState, move, valid, winner, playerAddress);
        const signature = await signMoveWithAddress(gameMove, playerAddress);
        return new SignedGameMove(gameMove, [signature]);
    }

    toGameStateContractParams(): TContractGameState {
        return { gameId: this.gameId, nonce: this.nonce, state: this.encode() }
    }

    encode(): string {
        const cellsToEncode = this.currentBoard.cells.map((cell) => {
            if (cell === null) {
                return 0;
            } else if (cell === 'X') {
                return 1;
            } else {
                return 2;
            }
        });
        let contractWinner = 0;
        if (this.winner) {
            contractWinner = this.winner + 1;
        }
        return defaultAbiCoder.encode(CHECKERS_STATE_TYPES, [cellsToEncode, this.redMoves, contractWinner]);
    }
}
