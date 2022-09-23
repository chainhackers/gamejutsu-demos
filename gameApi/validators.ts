import {ethers} from "ethers";
import {TBoardState} from "../types";
import {defaultAbiCoder} from "ethers/lib/utils";
import {IGameMove} from "../types/arbiter";
import {getArbiter} from "./index";


// https://github.com/ChainHackers/gamejutsu-contracts/blob/main/interfaces/IGameJutsuArbiter.sol#L82
//    function isValidGameMove(GameMove calldata gameMove) external view returns (bool);
//    function isValidSignedMove( SignedGameMove calldata signedMove) external view returns (bool);

export const isValidGameMove = async (iGameMove: IGameMove) => {

    const arbiter = await getArbiter();

    const isValid = await arbiter.isValidGameMove(
        iGameMove.toContractParams()
    );
    console.log(iGameMove.move, 'isValidGameMove', isValid);
    return isValid;
};
