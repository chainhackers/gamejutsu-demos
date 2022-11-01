import { IGameState, IMyGameMove, IMyGameBoard, TContractGameState, TPlayer, BaseGameState } from "../types";
import { IGameMove, ISignedGameMove } from "../../../types/arbiter";
import { defaultAbiCoder } from 'ethers/lib/utils';

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

export type TPiece = TPlayer | 'XX' | 'OO'

export type TCellData = null | TPiece ;
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
        [this.from, this.to, this.isJump, this.passMoveToOpponent] = defaultAbiCoder.decode(CHECKERS_MOVE_TYPES, encodedMove);
        this.player = player;
    }

    static fromEncoded(encodedMove: string, player: TPlayer): CHECKERSMove {
        return Object.seal(new CHECKERSMove(encodedMove, player));
    }

    static fromMove([from, to, isJump, passMoveToOpponent]: TCheckersContractMove, player: TPlayer): CHECKERSMove {
        const encodedMove = defaultAbiCoder.encode(CHECKERS_MOVE_TYPES, [from, to, isJump, passMoveToOpponent]);
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
        board.cells = cells.map((cell: number) => {
            if (cell == 0) {
                return null;
            } else if (cell == 1) {
                return 'X';
            } else if (cell == 2) {
                return 'O';
            }  else if (cell == 161) {
                return 'XX';
            } else if (cell == 162) {
                return 'OO';
            }
            return cell;
        });
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

export class CheckersState extends BaseGameState<CheckersBoard, CHECKERSMove> implements IGameState<CheckersBoard, CHECKERSMove> {

    constructor({ gameId, playerType, board = null }: { gameId: number; playerType: TPlayer; board?: CheckersBoard | null; }) {
        super({ gameId, playerType });
        this.currentBoard = board || CheckersBoard.empty();
    }

    fromEncodedBoard(encodedBoard:string): CheckersBoard {
        return CheckersBoard.fromEncoded(encodedBoard);
    }

    //TODO used only in game history. there are no kings or queens
    fromEncodedMove(encodedMove:string, opponentMove:boolean): CHECKERSMove {
        if (opponentMove) {
            return CHECKERSMove.fromEncoded(encodedMove, this.playerId == 0 ? 'O' : 'X');
        }
        return CHECKERSMove.fromEncoded(encodedMove, this.playerId == 0 ? 'X' : 'O')
    }
    
    //TODO move board encode to board togheter with winner and redmoves
    getRedMoves():boolean {
        return this.currentBoard.redMoves
    };

    encode(): string {
        const cellsToEncode = this.currentBoard.cells.map((cell) => {
            if (cell === null) {
                return 0;
            } else if (cell === 'X') {
                return 1;
            } else if (cell === 'O'){
                return 2;
            } else if (cell === 'XX') {
                return 161;
            } else if (cell === 'OO'){
                return 162;
            }
        });
        let contractWinner = 0;
        if (this.getWinnerId()) {
            contractWinner = this.getWinnerId()! + 1;
        }
        return defaultAbiCoder.encode(CHECKERS_STATE_TYPES, [cellsToEncode, this.getRedMoves(), contractWinner]);
    }
}
