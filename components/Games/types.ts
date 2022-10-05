import { signMoveWithAddress } from 'helpers/session_signatures';
import { shallowClone } from 'helpers/utils';
import { GameMove, IGameMove, ISignedGameMove, SignedGameMove } from '../../types/arbiter';

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
    winner: number | null;
    nonce: number

    makeNewGameState(contractGameState: TContractGameState, move: IMyGameMove, valid: boolean, winner: TPlayer | null): IGameState<IMyGameBoard, IMyGameMove>
    composeMove(contractGameState: TContractGameState,
        move: IMyGameMove,
        valid: boolean,
        winner: TPlayer | null, playerAddress: string): IGameMove;
    signMove(contractGameState: TContractGameState,
        move: IMyGameMove,
        valid: boolean,
        winner: TPlayer | null, playerAddress: string): Promise<ISignedGameMove>;
    toGameStateContractParams(): TContractGameState
    makeNewGameStateFromSignedMove(signedMove: ISignedGameMove, valid: boolean): IGameState<IMyGameBoard, IMyGameMove>
    makeNewGameStateFromOpponentsSignedMove(signedMove: ISignedGameMove, valid: boolean): IGameState<IMyGameBoard, IMyGameMove>
}

export abstract class BaseGameState<T1 extends IMyGameBoard<T2>, T2 extends IMyGameMove> {

    currentBoard!: T1;

    playerType: TPlayer;
    playerId: number;
    gameId: number;

    decodedMovesHistory: T2[] = [];
    disputableMoveNonces: Set<number> = new Set();
    nonce: number = 0;
    winner: number | null = null;
    movesHistory: TGameHistory = [];
    lastMove: ISignedGameMove | null = null;
    lastOpponentMove: ISignedGameMove | null = null;
    isFinished: boolean = false;

    abstract encode():string;
    abstract makeNewGameState(contractGameState: TContractGameState, move: T2, valid: boolean, winner: TPlayer | null): this;

    constructor({ gameId, playerType }: { gameId: number; playerType: TPlayer; }) {
        this.gameId = gameId;
        this.playerType = playerType;
        this.playerId = playerType === 'X' ? 0 : 1;
    }

    async signMove(
        contractGameState: TContractGameState,
        move: T2,
        valid: boolean = true,
        winner: TPlayer | null = null, playerAddress: string,
    ): Promise<ISignedGameMove> {
        const gameMove = this.composeMove(contractGameState, move, valid, winner, playerAddress);
        const signature = await signMoveWithAddress(gameMove, playerAddress);
        return new SignedGameMove(gameMove, [signature]);
    }

    toGameStateContractParams(): TContractGameState {
        return { gameId: this.gameId, nonce: this.nonce, state: this.encode() };
    }

    composeMove(contractGameState: TContractGameState,
        move: T2,
        valid: boolean = true,
        winner: TPlayer | null = null, playerAddress: string): IGameMove {
        return new GameMove(
            this.gameId,
            this.nonce,
            playerAddress,
            this.encode(),
            this.makeNewGameState(contractGameState, move, valid, winner).encode(),
            move.encodedMove,
        );
    }

    //TODO actually need decode move only for history
    //and winner only for future
    _makeNewGameState(nextCGameState: TContractGameState, move: T2, valid: boolean, winner: TPlayer | null): this {
        const nextState = shallowClone(this);
        nextState.gameId = nextCGameState.gameId;
        nextState.nonce = nextCGameState.nonce;
        this.updateWinner(nextState, winner);
        this.updateMoveHistory(nextState, move, valid);
        return nextState;    
    }


    protected updateMoveHistory(nextState: this, move: T2, valid: boolean) {
        nextState.decodedMovesHistory = [...this.decodedMovesHistory, move];
        const nextDisputableMoveNonces = new Set(this.disputableMoveNonces);
        if (!valid) {
            nextDisputableMoveNonces.add(this.nonce);
        }
        nextState.disputableMoveNonces = nextDisputableMoveNonces;
    }


    protected updateWinner(nextState: this, winner: string | null) {
        if (winner) {
            if (winner == this.playerType) {
                nextState.winner = this.playerId;
            } else {
                nextState.winner = 1 - this.playerId;
            }
        }
    }

}
