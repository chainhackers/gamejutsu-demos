import { defaultAbiCoder } from 'ethers/lib/utils';
import { IContractData, TBoardState } from 'types';
import { ethers, Transaction } from 'ethers';
import rulesContract from 'contracts/TicTacToeRules.json';
import { getSessionWallet, signMove } from 'helpers/session_signatures';
import { IGameMove, ISignedGameMove } from 'types/arbiter';
import arbiterContract from 'contracts/Arbiter.json';

export const getArbiter = () => fromContractData(arbiterContract);

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


export function newContract(addressOrName: string,
  contractInterface: ethers.ContractInterface,
  signerOrProvider?: ethers.Signer | ethers.providers.Provider
): ethers.Contract {
  const contract = new ethers.Contract(addressOrName, contractInterface, signerOrProvider);
  return contract;
}

// struct GameMove {
//   uint256 gameId;
//   uint256 nonce;
//   address player;
//   bytes oldState;
//   bytes newState;
//   bytes move;
// }

// struct SignedGameMove {
//   GameMove gameMove;
//   bytes[] signatures;
// }

// struct GameState {
//   uint256 gameId;
//   uint256 nonce;
//   bytes state;
// }
//Arbiter
//function isValidGameMove(GameMove calldata gameMove) external view returns (bool);
//function isValidSignedMove(SignedGameMove calldata signedMove) external view returns (bool);
//Rules
//function isValidMove(GameState calldata state, uint8 playerId, bytes calldata move) external pure returns (bool);

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
  const event = rc.events.find((event: { event: string; }) => event.event === 'GameProposed');
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
  const event = rc.events.find((event: { event: string; }) => event.event === 'GameStarted');
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
  const event = rc.events.find((event: { event: string; }) => event.event === 'GameFinished');
  const { gameId, winner, loser, draw } = event.args;
  return { gameId, winner, loser, draw };
};

export const getPlayers = async (contract: ethers.Contract, gamdId: string) => {
  const response = contract.getPlayers(gamdId);
  return response;
};

export const disputeMove = async (
  contract: ethers.Contract,
  gameId: number,
  nonce: number,
  playerAddress: string,
  oldBoardState: TBoardState,
  newBoardState: TBoardState,
  move: number,
  signatures: string[],
) => {
  const encodedOldBoardState = defaultAbiCoder.encode(
    ['uint8[9]', 'bool', 'bool'],
    oldBoardState,
  );

  const encodedNewBoardState = defaultAbiCoder.encode(
    ['uint8[9]', 'bool', 'bool'],
    newBoardState,
  );

  const encodedMove = defaultAbiCoder.encode(['uint8'], [move]);

  const gameMove = [
    gameId,
    nonce,
    playerAddress,
    encodedOldBoardState,
    encodedNewBoardState,
    encodedMove,
  ];

  const signedMove = [gameMove, signatures];

  const gasEstimated = await contract.estimateGas.disputeMove(signedMove);
  const response = contract.disputeMove(signedMove, { gasLimit: gasEstimated.mul(2) });

  return response;
};

export const checkIsValidMove = async (
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

  const response = contract.isValidMove(gameState, playerIngameId, encodedMove);

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
