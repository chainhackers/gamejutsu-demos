import {IGameState, IMyGameMove, IMyGameState, TGameHistory, TGameStateContractParams} from "../types";
import {GameMove, IGameMove, ISignedGameMove, SignedGameMove} from "../../../types/arbiter";
import {defaultAbiCoder} from 'ethers/lib/utils';
import {signMoveWithAddress} from "../../../helpers/session_signatures";
import { ChannelListener } from "diagnostics_channel";

const STATE_TYPES = ["uint8[32]", "bool", "uint8"]
const MOVE_TYPES = ["uint8", "uint8", "bool", "bool"]

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

export type TPlayer = 'X' | 'O';
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
        [this.from, this.to, this.isJump, this.passMoveToOpponent] = defaultAbiCoder.decode(MOVE_TYPES, encodedMove);
        this.player = player;
    }

    static fromEncoded(encodedMove: string, player: TPlayer): CHECKERSMove {
        return Object.seal(new CHECKERSMove(encodedMove, player));
    }

    static fromMove([from, to, isJump, passMoveToOpponent]: TCheckersContractMove, player: TPlayer): CHECKERSMove {
        const encodedMove = defaultAbiCoder.encode(MOVE_TYPES, [from, to, isJump, passMoveToOpponent]);
        return Object.seal(new CHECKERSMove(encodedMove, player));
    }
}

export class CheckersBoard implements IMyGameState<CHECKERSMove> {
    cells: TCells;
    disputableMoves: Set<number>;

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

    static fromHistory(history: CHECKERSMove[], disputableMoveNonces: Set<number>): CheckersBoard {
        return Object.seal(new CheckersBoard(history, disputableMoveNonces));
    }

    static empty(): CheckersBoard {
        let emtpyCheckersBoard = new CheckersBoard();
        return Object.seal(emtpyCheckersBoard) 
    }
}

export function decodeEncodedBoardState(encodedBoardState:string){
    return defaultAbiCoder.decode(STATE_TYPES, encodedBoardState);
}

// struct State {
//     uint8[32] cells;
//     bool redMoves;
//     uint8 winner;
// }

export function getWinnerFromEncodedState(state: string):TPlayer|null {
    const [_, redMoves, contractWinner] = decodeEncodedBoardState(state);
    let winner: TPlayer | null = null;
    if (contractWinner == 1) {
        winner = 'X';
    }
    else if (contractWinner == 2) {
        winner = 'O';
    }
    console.log('winner', winner);
    return winner;
}

export class CheckersState implements IGameState<CheckersBoard, CHECKERSMove> {
    movesHistory: TGameHistory = [];
    decodedMovesHistory: CHECKERSMove[] = [];
    disputableMoveNumbers: Set<number> = new Set();
    lastMove: ISignedGameMove | null = null;
    lastOpponentMove: ISignedGameMove | null = null;
    isFinished: boolean = false;
    winner: number | null = null;
    gameId: number;
    isMyTurn: boolean;
    myGameState: CheckersBoard;
    playerType: TPlayer;
    playerId: number;
    nonce: number = 0;

    constructor(gameId: number, playerType: TPlayer, board: CheckersBoard | null = null) {
        this.gameId = gameId;
        this.isMyTurn = playerType === 'X';
        this.myGameState = board || CheckersBoard.empty();
        this.playerType = playerType;
        this.playerId = playerType === 'X' ? 0 : 1;
    }


    encodedSignedMove(signedMove:ISignedGameMove, valid: boolean = true): IGameState<CheckersBoard, CHECKERSMove> {
        const winner = getWinnerFromEncodedState(signedMove.gameMove.newState);
        const move = CHECKERSMove.fromEncoded(signedMove.gameMove.move, this.playerId == 0 ? 'X' : 'O');
        return this.makeMove(move, valid, winner);
    }

    opponentSignedMove(signedMove:ISignedGameMove, valid: boolean = true): IGameState<CheckersBoard, CHECKERSMove> {
        const winner = getWinnerFromEncodedState(signedMove.gameMove.newState);
        const move = CHECKERSMove.fromEncoded(signedMove.gameMove.move, this.playerId == 0 ? 'O' : 'X'); //TODO reversed, remove hack
        return this.makeMove(move, valid)
    }

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
        nextState.nonce = this.nonce + 1;
        nextState.decodedMovesHistory = [...this.decodedMovesHistory, move];
        const nextDisputableMoveNonces = new Set(this.disputableMoveNumbers);

        if (!valid) {
            nextDisputableMoveNonces.add(this.nonce);
        }

        nextState.disputableMoveNumbers = nextDisputableMoveNonces;
        nextState.myGameState = CheckersBoard.fromHistory(nextState.decodedMovesHistory, nextState.disputableMoveNumbers);
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

    //TODO deduplicate
    composeMove(move: CHECKERSMove, playerAddress: string): IGameMove {
        return new GameMove(
            this.gameId,
            this.nonce,
            playerAddress,
            this.encode(),
            this.makeMove(move).encode(),
            move.encodedMove,
        )
    }

    async signMove(move: CHECKERSMove, playerAddress: string, winner: TPlayer | null): Promise<ISignedGameMove> {
        const gameMove = new GameMove(
            this.gameId,
            this.nonce,
            playerAddress,
            this.encode(),
            this.makeMove(move, undefined, winner).encode(),
            move.encodedMove,
        )
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
        return defaultAbiCoder.encode(STATE_TYPES, [cellsToEncode, this.playerId == 1, contractWinner]);
    }
}
