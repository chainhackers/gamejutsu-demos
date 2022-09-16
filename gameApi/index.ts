import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { IContractData, TBoardState } from 'types';

const web3 = new Web3(Web3.givenProvider);

export const connectContract = async (abi: AbiItem[], address: string) => {
  const contract = await new web3.eth.Contract(abi as AbiItem[], address);
  return contract;
};

export const proposeGame = async (
  arbiterContractData: IContractData,
  curentPlayerId: string,
): Promise<any> => {
  const contract = await connectContract(arbiterContractData.abi, arbiterContractData.address);

  const gameId = await contract.methods
    .proposeGame(curentPlayerId)
    .send({ from: curentPlayerId });

  return gameId;
};

export const acceptGame = async (
  arbiterContractData: IContractData,
  curentPlayerId: string,
  gamdId: string,
): Promise<any> => {
  const contract = await connectContract(arbiterContractData.abi, arbiterContractData.address);

  const acceptedGameData = await contract.methods
    .acceptGame(gamdId)
    .send({ from: curentPlayerId });

  return acceptedGameData;
};

export const getPlayers = async (arbiterContractData: IContractData, gamdId: number) => {
  const contract = await connectContract(arbiterContractData.abi, arbiterContractData.address);
  const players = await contract.methods.getPlayers(gamdId).call();
  return players;
};

export const disputeMove = async (
  arbiterContractData: IContractData,
  gameId: number,
  nonce: number,
  playerAddress: string,
  oldBoardState: TBoardState,
  newBoardState: TBoardState,
  move: number,
  signatures: string[],
) => {
  const contract = await connectContract(arbiterContractData.abi, arbiterContractData.address);

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

  const disputeMoveResult = await contract.methods.disputeMove(signedMove).call();

  return disputeMoveResult;
};

export const checkIsValidMove = async (
  gameRulesContractData: IContractData,
  gameId: number,
  nonce: number,
  boardState: TBoardState,
  playerIngameId: number,
  move: number,
) => {
  const contract = await connectContract(
    gameRulesContractData.abi,
    gameRulesContractData.address,
  );

  const encodedBoardState = defaultAbiCoder.encode(['uint8[9]', 'bool', 'bool'], boardState);

  const gameState = [gameId, nonce, encodedBoardState];

  const encodedMove = defaultAbiCoder.encode(['uint8'], [move]);

  const isMoveValid = await contract.methods
    .isValidMove(gameState, playerIngameId, encodedMove)
    .call();

  return isMoveValid;
};

export const transition = async (
  gameRulesContractData: IContractData,
  gameId: number,
  nonce: number,
  boardState: TBoardState,
  playerIngameId: number,
  move: number,
) => {
  const contract = await connectContract(
    gameRulesContractData.abi,
    gameRulesContractData.address,
  );

  const encodedBoardState = defaultAbiCoder.encode(['uint8[9]', 'bool', 'bool'], boardState);

  const gameState = [gameId, nonce, encodedBoardState];

  const encodedMove = defaultAbiCoder.encode(['uint8'], [move]);

  const transitionResult = await contract.methods
    .transition(gameState, playerIngameId, encodedMove)
    .call();

  return transitionResult;
};

export default {
  proposeGame,
  acceptGame,
  getPlayers,
  disputeMove,
  checkIsValidMove,
  transition,
};
