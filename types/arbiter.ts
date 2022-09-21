export const TIC_TAC_TOE_STATE_TYPES = ['uint8[9]', 'bool', 'bool']

export type TGameMoveContractParams = [number, number, string, string, string, string];
export type TSignedGameMoveContractParams = [[number, number, string, string, string, string], string[]];

// https://github.com/ChainHackers/gamejutsu-contracts/blob/main/interfaces/IGameJutsuArbiter.sol#L33
//    struct GameMove {
//         uint256 gameId;
//         uint256 nonce;
//         address player;
//         bytes oldState;
//         bytes newState;
//         bytes move;
//     }
export interface IGameMove {
    gameId: number;
    nonce: number;
    player: string;
    oldState: string;
    newState: string;
    move: string;

    toContractParams(): TGameMoveContractParams;
}

export interface ISignedGameMove {
    gameMove: IGameMove;
    signatures: string[];
}

export class GameMove implements IGameMove {
    gameId: number;
    nonce: number;
    player: string;
    oldState: string;
    newState: string;
    move: string;

    constructor(gameId: number, nonce: number, player: string, oldState: string, newState: string, move: string) {
        this.gameId = gameId;
        this.nonce = nonce;
        this.player = player; //address
        this.oldState = oldState;
        this.newState = newState;
        this.move = move;
    }

    toContractParams(): TGameMoveContractParams {
        return [
            this.gameId, this.nonce, this.player, this.oldState, this.newState, this.move
        ];
    }
}

// https://github.com/ChainHackers/gamejutsu-contracts/blob/main/interfaces/IGameJutsuArbiter.sol#L42
//    struct SignedGameMove {
//         GameMove gameMove;
//         bytes[] signatures;
//     }

export class SignedGameMove implements ISignedGameMove {
    gameMove: IGameMove;
    signatures: string[];

    constructor(gameMove: IGameMove, signatures: string[]) {
        this.gameMove = gameMove;
        this.signatures = signatures;
    }

    toContractParams(): TSignedGameMoveContractParams {
        return [
            this.gameMove.toContractParams(),
            this.signatures
        ];
    }
}
