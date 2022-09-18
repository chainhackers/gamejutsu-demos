import { defaultAbiCoder } from 'ethers/lib/utils';
import { IContractData, TBoardState } from 'types';
import { ethers, Transaction } from 'ethers';

export function fromContractData(data: IContractData):ethers.Contract {
  const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
  console.log('provider', provider);
  const signer = provider.getSigner();
  console.log('signer', signer);
  return newContract(data.address, data.abi, signer);
}


export function newContract(addressOrName: string,
  contractInterface: ethers.ContractInterface,
  signerOrProvider?: ethers.Signer | ethers.providers.Provider
  ):ethers.Contract {
  const contract = new ethers.Contract(addressOrName, contractInterface, signerOrProvider);
  return contract;
}

export const proposeGame = async (
  contract: ethers.Contract,
  currentPlayerId: string,
): Promise<{ gameId: string; proposer: string; stake: string }> => {

  //TODO d be rules contract address;
  const gasEstimated =  await contract.estimateGas.proposeGame(currentPlayerId, []);
  const tx = await contract.proposeGame(currentPlayerId, [], {gasLimit: gasEstimated.mul(2)});
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
  const gasEstimated =  await contract.estimateGas.acceptGame(gamdIdToAccept, []);
  const tx =  await contract.acceptGame(gamdIdToAccept, [], {gasLimit: gasEstimated.mul(2)});
  console.log('tx', tx);
  const rc = await tx.wait(); 
  console.log('rc', rc);
  const event = rc.events.find((event: { event: string; }) => event.event === 'GameStarted');
  const { gameId, players, stake } = event.args;
  return { gameId, players, stake };
};

export const getPlayers = async (contract: ethers.Contract, gamdId: string) => {
  const response =  contract.getPlayers(gamdId);
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

  const gasEstimated =  await contract.estimateGas.disputeMove(signedMove);
  const response =  contract.disputeMove(signedMove, {gasLimit: gasEstimated.mul(2)});

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

  const response =  contract.isValidMove(gameState, playerIngameId, encodedMove);

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
  getPlayers,
  disputeMove,
  checkIsValidMove,
  transition,
};
