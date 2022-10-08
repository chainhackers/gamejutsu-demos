import {ISignedGameMove} from "../../types/arbiter";

export interface IGameConversation {
    gameId: number;
    moves: ISignedGameMove[]; //filtered by game, sorted by nonce
    getMove(nonce: number): ISignedGameMove | null;

    getMoves(fromNonce: number, toNonce: number): ISignedGameMove[];

    onNewMove: (move: ISignedGameMove) => void;
}
