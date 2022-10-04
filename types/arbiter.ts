export const TIC_TAC_TOE_STATE_TYPES = ['uint8[9]', 'bool', 'bool']

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
    player: string; //address
    oldState: string;
    newState: string;
    move: string;
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

    constructor(gameId: number, nonce: number, playerAddress: string, oldEncodedGameBoard: string, newEncodedGameBoard: string, encodedMove: string) {
        this.gameId = gameId;
        this.nonce = nonce;
        this.player = playerAddress; //address
        this.oldState = oldEncodedGameBoard;
        this.newState = newEncodedGameBoard;
        this.move = encodedMove;
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
}
