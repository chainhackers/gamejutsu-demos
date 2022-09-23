import { defaultAbiCoder } from 'ethers/lib/utils';
import { IContractData, TBoardState } from 'types';
import { ethers } from 'ethers';
import { getSessionWallet, signMove } from 'helpers/session_signatures';
import arbiterContract from 'contracts/Arbiter.json';
import tictacRulesContract from 'contracts/TicTacToeRules.json';
import {IGameMove, ISignedGameMove} from "../types/arbiter";
import { TGameStateContractParams } from 'components/Games/types';

export const getArbiter = () => fromContractData(arbiterContract);
export const getRulesContract = (gameType: string | undefined) => {
  return fromContractData(tictacRulesContract);
} 

export function getSigner(): ethers.Signer {
  const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
  console.log('provider', provider);
  const signer = provider.getSigner();
  console.log('signer', signer);
  return signer;
}

export function fromContractData(data: IContractData): ethers.Contract {
  return newContract(data.address, data.abi, getSigner());
}

export function newContract(
  addressOrName: string,
  contractInterface: ethers.ContractInterface,
  signerOrProvider?: ethers.Signer | ethers.providers.Provider
): ethers.Contract {
  const contract = new ethers.Contract(addressOrName, contractInterface, signerOrProvider);
  return contract;
}

//   @notice both moves must be in sequence
//   @notice first move must be signed by both players
//   @notice second move must be signed at least by the player making the move
//   @notice no timeout should be active for the game
//  */
//   function initTimeout(SignedGameMove[2] calldata moves) payable external
//   emit TimeoutStarted(gameId, moves[1].gameMove.player, moves[1].gameMove.nonce, block.timestamp + TIMEOUT);
export const initTimeout = async (
  contract: ethers.Contract,
  signedGameMoves: [ISignedGameMove, ISignedGameMove],
) => {
  console.log('signedGameMoves', signedGameMoves);
  const value = ethers.BigNumber.from(10).pow(17);
  const gasEstimated = await contract.estimateGas.initTimeout(signedGameMoves, {value});
  const tx = await contract.initTimeout(signedGameMoves, { value, gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const event = rc.events.find((event: { event: string }) => event.event === 'TimeoutStarted');
  return {...event.args};
};        
    
// /**
//     @notice a single valid signed move is enough to resolve the timout
//     @notice the move must be signed by the player whos turn it is
//     @notice the move must continue the game from the move started the timeout
//    */
//     function resolveTimeout(SignedGameMove calldata signedMove) external
//     emit TimeoutResolved(gameId, signedMove.gameMove.player, signedMove.gameMove.nonce);
export const resolveTimeout = async (
  contract: ethers.Contract,
  signedGameMove: ISignedGameMove,
) => {
  const gasEstimated = await contract.estimateGas.resolveTimeout(signedGameMove);
  const tx = await contract.resolveTimeout(signedGameMove, { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const event = rc.events.find((event: { event: string }) => event.event === 'TimeoutResolved');
  return {...event.args};
};        
    
// /**
//     @notice the timeout must be expired
//     @notice 2 player games only
//    */
// function finalizeTimeout(uint256 gameId) external
// disqualifyPlayer(gameId, loser);
export const finalizeTimeout = async (
  contract: ethers.Contract,
  gameId: number,
) => {
  const gasEstimated = await contract.estimateGas.finalizeTimeout(gameId);
  const tx = await contract.finalizeTimeout(gameId, { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const gameFinishedEvent = rc.events.find((event: { event: string }) => event.event === 'GameFinished');
  const playerDisqualifiedEvent = rc.events.find((event: { event: string }) => event.event === 'PlayerDisqualified');
  return {...gameFinishedEvent.args, ...playerDisqualifiedEvent.args};
};

//emit GameFinished(gameId, winner, cheater, false);
//emit PlayerDisqualified(gameId, cheater);
export const disputeMove = async (
  contract: ethers.Contract,
  signedGameMove: ISignedGameMove,
) => {
  const gasEstimated = await contract.estimateGas.disputeMove(signedGameMove);
  const tx = await contract.disputeMove(signedGameMove, { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const gameFinishedEvent = rc.events.find((event: { event: string }) => event.event === 'GameFinished');
  const playerDisqualifiedEvent = rc.events.find((event: { event: string }) => event.event === 'PlayerDisqualified');
  return {...gameFinishedEvent.args, ...playerDisqualifiedEvent.args};
};

export const checkIsValidMove = async (
  contract: ethers.Contract,
  gameState: TGameStateContractParams,
  playerIngameId: number,
  encodedMove: string,
) => {
  console.log('checkIsValidMove', {gameState, playerIngameId, encodedMove});
  const response = contract.isValidMove(gameState, playerIngameId, encodedMove);
  console.log('response', response);
  return response;
};


export const isValidGameMove = async (
  contract: ethers.Contract,
  gameMove: IGameMove,
) => {
  console.log('isValidGameMove', {contract, gameMove});
  const response = contract.isValidGameMove(gameMove);
  console.log({response});
  return response;
};


export const isValidSignedMove = async (
  contract: ethers.Contract,
  gameMove: IGameMove,
  signatures: string[] = []
) => {
  let wallet = await getSessionWallet(await getSigner().getAddress());
  let signature:string  = await signMove(gameMove, wallet);
  signatures.push(signature);
  return _isValidSignedMove(contract, {gameMove, signatures});
};

export const _isValidSignedMove = async (
  contract: ethers.Contract,
  signedgameMove: ISignedGameMove,
) => {
  console.log('isValidSignedMove', {contract, signedgameMove});
  const response = contract.isValidSignedMove(signedgameMove);
  console.log({response});
  return response;
};

export async function registerSessionAddress(
  contract: ethers.Contract,
  gameId: number,
  wallet: ethers.Wallet,
): Promise<void> {
  const gasEstimatedRedeem = await contract.estimateGas.registerSessionAddress(
    gameId,
    wallet.address,
  );
  return contract.registerSessionAddress(gameId, wallet.address, {
    gasLimit: gasEstimatedRedeem.mul(4),
  });
}


export const proposeGame = async (
  contract: ethers.Contract,
  rulesContractAddress: string,
): Promise<{ gameId: string; proposer: string; stake: string }> => {
  console.log('proposeGame', {contract, rulesContractAddress});
  let wallet = await getSessionWallet(await getSigner().getAddress());
  const gasEstimated = await contract.estimateGas.proposeGame(rulesContractAddress, []);
  const tx = await contract.proposeGame(
    rulesContractAddress,
    [wallet.address],
    { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const event = rc.events.find((event: { event: string }) => event.event === 'GameProposed');
  const { gameId, proposer, stake } = event.args;
  return { gameId, proposer, stake };
};

export const acceptGame = async (
  contract: ethers.Contract,
  gamdIdToAccept: string,
): Promise<{ gameId: string; players: [string, string]; stake: string }> => {
  const gasEstimated = await contract.estimateGas.acceptGame(gamdIdToAccept, []);
  let wallet = await getSessionWallet(await getSigner().getAddress());
  const tx = await contract.acceptGame(gamdIdToAccept,
      [wallet.address],
      { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const event = rc.events.find((event: { event: string }) => event.event === 'GameStarted');
  const { gameId, players, stake } = event.args;
  return { gameId, players, stake };
};

export const resign = async (
  contract: ethers.Contract,
  gameIdToResign: string,
): Promise<{ gameId: string; winner: string; loser: string; draw: boolean }> => {
  const gasEstimated = await contract.estimateGas.resign(gameIdToResign);
  const tx = await contract.resign(gameIdToResign, { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const event = rc.events.find((event: { event: string }) => event.event === 'GameFinished');
  const { gameId, winner, loser, draw } = event.args;
  return { gameId, winner, loser, draw };
};

export const getPlayers = async (contract: ethers.Contract, gamdId: string) => {
  const response = contract.getPlayers(gamdId);
  return response;
};



export const transition = async (
  contract: ethers.Contract,
  gameId: number,
  nonce: number,
  boardState: TBoardState,
  playerIngameId: number,
  move: number,
) => {
  const encodedBoardState = defaultAbiCoder.encode(['uint8[9]', 'bool', 'bool'], boardState);

  const gameState = [gameId, nonce, encodedBoardState];

  const encodedMove = defaultAbiCoder.encode(['uint8'], [move]);

  const response = await contract.transition(gameState, playerIngameId, encodedMove);
  return response;
};

export default {
  fromContractData,
  newContract,
  proposeGame,
  acceptGame,
  resign,
  getPlayers,
  disputeMove,
  checkIsValidMove,
  transition,
};
