import {ethers} from "ethers";
import {TBoardState} from "../types";
import {defaultAbiCoder} from "ethers/lib/utils";


// https://github.com/ChainHackers/gamejutsu-contracts/blob/main/interfaces/IGameJutsuArbiter.sol#L82
//    function isValidGameMove(GameMove calldata gameMove) external view returns (bool);
//    function isValidSignedMove( SignedGameMove calldata signedMove) external view returns (bool);

export const isValidGameMove = async (
    // contract: ethers.Contract,
    gameId: number,
    nonce: number,
    playerAddress: string,
    oldBoardState: TBoardState,
    newBoardState: TBoardState,
    move: number,
    signatures: string[],
) => {
    // const encodedOldBoardState = defaultAbiCoder.encode(
    //     ['uint8[9]', 'bool', 'bool'],
    //     oldBoardState,
    // );
    //
    // const encodedNewBoardState = defaultAbiCoder.encode(
    //     ['uint8[9]', 'bool', 'bool'],
    //     newBoardState,
    // );
    //
    // const encodedMove = defaultAbiCoder.encode(['uint8'], [move]);
    //
    // const gameMove = [
    //     gameId,
    //     nonce,
    //     playerAddress,
    //     encodedOldBoardState,
    //     encodedNewBoardState,
    //     encodedMove,
    // ];
    //
    // const signedMove = [gameMove, signatures];
    //
    // const gasEstimated =  await contract.estimateGas.disputeMove(signedMove);
    // const response =  contract.disputeMove(signedMove, {gasLimit: gasEstimated.mul(2)});
    //
    // return response;
};
