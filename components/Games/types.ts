import {signMoveWithAddress} from 'helpers/session_signatures';
import {shallowClone} from 'helpers/utils';
import {GameMove, IGameMove, ISignedGameMove, SignedGameMove} from '../../types/arbiter';

export type TPlayer = 'X' | 'O';
export type TGameHistory = ISignedGameMove[]

export interface IMyGameMove {
    encodedMove: string;
}

export interface IMyGameBoard<T extends IMyGameMove> {
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
    decodedMovesHistory: IMyGameMove[];
    disputableMoveNonces: Set<number>;
    lastMove: ISignedGameMove | null;
    lastOpponentMove: ISignedGameMove | null;
    currentBoard: IMyGameBoard;
    isFinished: boolean;
    nonce: number

    getWinnerId(): number | null;

    makeNewGameState(
        contractGameState: TContractGameState,
        valid: boolean,
        gameMove: IGameMove,
        fromOpponent: boolean,
    ): IGameState<IMyGameBoard, IMyGameMove>

    composeMove(
        move: IMyGameMove,
        nextContractGameState: TContractGameState,
        valid: boolean,
        playerAddress: string): IGameMove;

    signMove(gameMove: IGameMove, playerAddress: string): Promise<ISignedGameMove>

    toGameStateContractParams(): TContractGameState

    makeNewGameStateFromSignedMove(signedMove: ISignedGameMove, valid: boolean, isOpponentMove: boolean, lastOpponentMove?: ISignedGameMove | null): IGameState<IMyGameBoard, IMyGameMove>
}

export abstract class BaseGameState<T1 extends IMyGameBoard<T2>, T2 extends IMyGameMove> implements IGameState<IMyGameBoard<IMyGameMove>, IMyGameMove> {

    currentBoard!: T1;
    playerType: TPlayer;
    playerId: number;
    gameId: number;

    decodedMovesHistory: T2[] = [];
    disputableMoveNonces: Set<number> = new Set();
    nonce: number = 0;
    movesHistory: TGameHistory = [];
    lastMove: ISignedGameMove | null = null;
    lastOpponentMove: ISignedGameMove | null = null;
    isFinished: boolean = false;

    abstract encode(): string;

    abstract fromEncodedBoard(encodedBoardState: string): T1;

    abstract fromEncodedMove(encodedMove: string, opponentMove: boolean): T2;

    constructor({gameId, playerType}: { gameId: number; playerType: TPlayer; }) {
        this.gameId = gameId;
        this.playerType = playerType;
        this.playerId = playerType === 'X' ? 0 : 1;
    }

    composeMove(
        move: T2,
        nextContractGameState: TContractGameState,
        valid: boolean = true,
        playerAddress: string): IGameMove {
        return new GameMove(
            this.gameId,
            this.nonce,
            playerAddress,
            this.encode(),
            this.makeNewGameState(nextContractGameState, valid).encode(),
            move.encodedMove,
        );
    }

    //TODO Add player address of game initiator to properties
    //and session player address here
    async signMove(gameMove: IGameMove, playerAddress: string): Promise<ISignedGameMove> {
        const signature = await signMoveWithAddress(gameMove, playerAddress);
        return new SignedGameMove(gameMove, [signature]);
    }

    toGameStateContractParams(): TContractGameState {
        return {gameId: this.gameId, nonce: this.nonce, state: this.encode()};
    }

    getWinnerId(): number | null {
        let winner = this.currentBoard.getWinner()
        if (winner) {
            if (winner == this.playerType) {
                return this.playerId;
            } else {
                return 1 - this.playerId;
            }
        }
        return null;
    }

    makeNewGameState(nextContractGameState: TContractGameState, valid: boolean): this {
        const nextState = shallowClone(this);
        nextState.currentBoard = this.fromEncodedBoard(nextContractGameState.state);
        nextState.gameId = nextContractGameState.gameId;
        nextState.nonce = nextContractGameState.nonce;
        return nextState;
    }

    protected _makeNewGameStateFromSignedMove(signedMove: ISignedGameMove, valid: boolean): this {
        return this.makeNewGameState({
            gameId: signedMove.gameMove.gameId,
            nonce: signedMove.gameMove.nonce + 1,
            state: signedMove.gameMove.newState,
        }, valid);
    }

    makeNewGameStateFromSignedMove(signedMove: ISignedGameMove, valid: boolean, isOpponentMove: boolean, lastOpponentMove?: ISignedGameMove): this {
        if (isOpponentMove) {
            const nextState = this._makeNewGameStateFromSignedMove(signedMove, valid);
            nextState.lastOpponentMove = signedMove;
            if (!!lastOpponentMove) nextState.lastMove = lastOpponentMove;
            this._updateMoveHistory(nextState, this.fromEncodedMove(signedMove.gameMove.move, true), valid);
            return Object.freeze(nextState);
        }
        const nextState = this._makeNewGameStateFromSignedMove(signedMove, valid);
        nextState.lastMove = signedMove;
        if (!!lastOpponentMove) nextState.lastOpponentMove = lastOpponentMove;
        this._updateMoveHistory(nextState, this.fromEncodedMove(signedMove.gameMove.move, false), valid);
        return Object.freeze(nextState);
    }

    protected _updateMoveHistory(nextState: this, move: T2, valid: boolean) {
        nextState.decodedMovesHistory = [...this.decodedMovesHistory, move];
        const nextDisputableMoveNonces = new Set(this.disputableMoveNonces);
        if (!valid) {
            nextDisputableMoveNonces.add(this.nonce);
        }
        nextState.disputableMoveNonces = nextDisputableMoveNonces;
    }
}
