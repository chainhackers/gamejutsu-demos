import {IGameState, IMyGameMove, IMyGameState, TGameHistory, TGameStateContractParams, TPlayer} from "../types";
import {GameMove, IGameMove, ISignedGameMove, SignedGameMove} from "../../../types/arbiter";
import {defaultAbiCoder} from 'ethers/lib/utils';
import {signMoveWithAddress} from "../../../helpers/session_signatures";
import { ChannelListener } from "diagnostics_channel";

export const CHECKERS_STATE_TYPES = ["uint8[32]", "bool", "uint8"]
export const CHECKERS_MOVE_TYPES = ["uint8", "uint8", "bool", "bool"]

export function decodeEncodedBoardState(encodedBoardState:string){
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

export class CheckersBoard implements IMyGameState<CHECKERSMove> {
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
    disputableMoveNumbers: Set<number> = new Set();
    lastMove: ISignedGameMove | null = null;
    lastOpponentMove: ISignedGameMove | null = null;
    isFinished: boolean = false;
    winner: number | null = null;
    gameId: number;
    redMoves: boolean; //aka redMoves
    myGameState: CheckersBoard;
    playerType: TPlayer;
    playerId: number;
    nonce: number = 0;

    constructor(gameId: number, playerType: TPlayer, board: CheckersBoard | null = null) {
        this.gameId = gameId;
        this.redMoves = true; //playerType === 'O';
        this.myGameState = board || CheckersBoard.empty();
        this.playerType = playerType;
        this.playerId = playerType === 'X' ? 0 : 1;
    }


    encodedSignedMove(signedMove:ISignedGameMove, valid: boolean = true): IGameState<CheckersBoard, CHECKERSMove> {
        const winner = CheckersBoard.fromEncoded(signedMove.gameMove.newEncodedGameBoard).winner;
        console.log('encodedSignedMove this.playerId', this.playerId);
        const move = CHECKERSMove.fromEncoded(signedMove.gameMove.encodedMove, this.playerId == 0 ? 'X' : 'O');
        return this.makeMove(move, valid, winner);
    }

    opponentSignedMove(signedMove:ISignedGameMove, valid: boolean = true): IGameState<CheckersBoard, CHECKERSMove> {
        const winner = CheckersBoard.fromEncoded(signedMove.gameMove.newEncodedGameBoard).winner;
        console.log('opponentSignedMove this.playerId', this.playerId);
        const move = CHECKERSMove.fromEncoded(signedMove.gameMove.encodedMove, this.playerId == 0 ? 'O' : 'X'); //TODO reversed, remove hack
        return this.makeMove(move, valid, winner);
    }

    // _makeMove(move: CHECKERSMove, valid: boolean = true, winner: TPlayer | null = null): CheckersState {
        
    // }

    makeMove(move: CHECKERSMove, valid: boolean = true, winner: TPlayer | null = null): CheckersState {
        //TODO it should be copy constructor, at least for lastMove and lastOpponentMove
        const nextState = new CheckersState(this.gameId, this.playerType);
        if (winner) {
            if (winner == this.playerType) {
                nextState.winner = this.playerId;
            } else {
                nextState.winner = 1 - this.playerId;
            }
        }
        if (move.passMoveToOpponent) {
            nextState.redMoves = !this.redMoves;
        }
        nextState.nonce = this.nonce + 1;
        nextState.decodedMovesHistory = [...this.decodedMovesHistory, move];

        const nextDisputableMoveNonces = new Set(this.disputableMoveNumbers);

        if (!valid) {
            nextDisputableMoveNonces.add(this.nonce);
        }

        nextState.disputableMoveNumbers = nextDisputableMoveNonces;
        nextState.myGameState = CheckersBoard.fromHistory(nextState.decodedMovesHistory, nextState.disputableMoveNumbers);
        console.log('nextState', CheckersBoard.fromEncoded(nextState.encode()));
        return Object.seal(nextState);
    }

    encodedMove(encodedMove: string, valid: boolean = true): CheckersState {
        const move = CHECKERSMove.fromEncoded(encodedMove, this.playerId == 0 ? 'X' : 'O');
        return this.makeMove(move, valid)
    }

    opponentMove(encodedMove: string, valid: boolean = true): CheckersState {
        const move = CHECKERSMove.fromEncoded(encodedMove, this.playerId == 0 ? 'O' : 'X'); //TODO reversed, remove hack
        return this.makeMove(move, valid)
    }

    composeMove(move: CHECKERSMove, playerAddress: string, winner: TPlayer | null): IGameMove {
        const gameMove = new GameMove(
            this.gameId,
            this.nonce,
            playerAddress,
            this.encode(),
            this.makeMove(move, undefined, winner).encode(),
            move.encodedMove,
        )
        return gameMove;
    }

    async signMove(move: CHECKERSMove, playerAddress: string, winner: TPlayer | null): Promise<ISignedGameMove> {
        const gameMove = this.composeMove(move, playerAddress, winner);
        const signature = await signMoveWithAddress(gameMove, playerAddress);
        return new SignedGameMove(gameMove, [signature]);
    }

    toGameStateContractParams(): TGameStateContractParams {
        return { gameId: this.gameId, nonce: this.nonce, state: this.encode()}
    }

    encode(): string {
        const cellsToEncode = this.myGameState.cells.map((cell) => {
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
