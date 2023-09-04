import {BigNumber, ethers} from 'ethers';
import {createSessionWallet, getSessionWallet} from 'helpers/session_signatures';
import {IGameMove, ISignedGameMove} from "../types/arbiter";
import {TContractGameState} from 'components/Games/types';
import {
  Arbiter,
  GameProposedEventObject,
  GameStartedEventObject
} from "../.generated/contracts/esm/types/polygon/Arbiter";
import {getPolygonSdk} from "../.generated/contracts";
import {TGameType} from 'types/game';
import {fetchSigner} from '@wagmi/core';
import {useState} from "react";

const provider = new ethers.providers.AlchemyProvider('matic', process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!);
const getSdk = async () => getPolygonSdk(await getSigner())
const getSdkRead = () => getPolygonSdk(provider);
export const getArbiter = async (): Promise<Arbiter> => (await getSdk()).arbiter;
export const getArbiterRead = async () => getSdkRead().arbiter;

export const getRulesContract = async (gameType: TGameType): Promise<ethers.Contract> => {
  if (gameType == 'checkers') {
    return getSdkRead().checkersRules;
  }
  if (gameType == 'tic-tac-toe') {
    return getSdkRead().ticTacToeRules;
  }
  throw "Unknown gameType: " + gameType;
}

export async function getSigner(): Promise<ethers.Signer> {
  const signer = await fetchSigner();
  return signer!;
}

export async function getSignerAddress(): Promise<string> {
  return (await getSigner()).getAddress();
}

export type TGameFinished = { gameId: number, winner: string, loser: string, isDraw: boolean };
type TPlayerDisqualified = { gameId: number, player: string };
type TPlayerResigned = { gameId: number, player: string };

export class RunDisputeState {
  gameId: number;
  disputeRunner: string;

  constructor(gameId: number, disputeRunner: string) {
    this.gameId = gameId;
    this.disputeRunner = disputeRunner;
  }
}

export class FinishedGameState {
  gameId: number;
  winner: string | null;
  loser: string | null;
  isDraw: boolean;
  disqualified: string | null;
  resigned: string | null;

  constructor(gameId: number, winner: string | null = null, loser: string | null = null, isDraw: boolean,
              disqualified: string | null = null, resigned: string | null = null) {
    this.gameId = gameId;
    this.winner = winner;
    this.loser = loser;
    this.isDraw = isDraw;
    this.disqualified = disqualified;
    this.resigned = resigned;
  }

  static fromGameFinishedArgs(gameFinished: TGameFinished) {
    return new FinishedGameState(gameFinished.gameId, gameFinished.winner, gameFinished.loser,
      gameFinished.isDraw);
  }

  addPlayerDisqualified(playerDisqualified: TPlayerDisqualified) {
    this.gameId = playerDisqualified.gameId;
    this.disqualified = playerDisqualified.player;
    return this;
  }

  addPlayerResigned(playerResigned: TPlayerResigned) {
    this.gameId = playerResigned.gameId;
    this.resigned = playerResigned.player;
    return this;
  }
}

// mark the winning move as such - in case of tic-tac-toe, set the respective flag to True

// struct Board {
//     uint8[9] cells;
//     bool crossesWin;
//     bool naughtsWin;
// }
//function finishGame(SignedGameMove[2] calldata signedMoves) external returns (address winner);
//emit GameFinished(gameId, winner, cheater, false);
export const finishGame = async (
  contract: ethers.Contract,
  signedGameMoves: [ISignedGameMove, ISignedGameMove],
) => {
  console.log('GameAPI finishGame: signedGameMoves = ', signedGameMoves);
  const gasEstimated = await contract.estimateGas.finishGame(signedGameMoves);
  const tx = await contract.finishGame(signedGameMoves, {gasLimit: gasEstimated.mul(2)});
  console.log('GameAPI finishGame: tx = ', tx);
  const receipt = await tx.wait();
  console.log('GameAPI finishGame: receipt = ', receipt);
  const gameFinishedEvent = receipt.events.find((event: { event: string }) => event.event === 'GameFinished');
  return FinishedGameState.fromGameFinishedArgs(gameFinishedEvent.args);
};

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
  console.log('GameAPI initTimeout: signedGameMoves = ', signedGameMoves);
  const value = ethers.BigNumber.from(10).pow(17);
  const gasEstimated = await contract.estimateGas.initTimeout(signedGameMoves, {value});
  const tx = await contract.initTimeout(signedGameMoves, {value, gasLimit: gasEstimated.mul(2)});
  console.log('GameAPI initTimeout: tx = ', tx);
  const receipt = await tx.wait();
  console.log('GameAPI initTimeout: receipt = ', receipt);
  const event = receipt.events.find((event: { event: string }) => event.event === 'TimeoutStarted');
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
  console.log('GameAPI resolveTimeout: signedGameMove = ', signedGameMove);
  const gasEstimated = await contract.estimateGas.resolveTimeout(signedGameMove);
  const tx = await contract.resolveTimeout(signedGameMove, {gasLimit: gasEstimated.mul(2)});
  console.log('GameAPI resolveTimeout: tx = ', tx);
  const receipt = await tx.wait();
  console.log('GameAPI resolveTimeout: receipt = ', receipt);
  const event = receipt.events.find((event: { event: string }) => event.event === 'TimeoutResolved');
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
  gameId: BigNumber,
): Promise<FinishedGameState> => {
  const gasEstimated = await contract.estimateGas.finalizeTimeout(gameId);
  const tx = await contract.finalizeTimeout(gameId, {gasLimit: gasEstimated.mul(2)});
  console.log('GameAPI finalizeTimeout: tx = ', tx);
  const receipt = await tx.wait();
  console.log('GameAPI finalizeTimeout: receipt = ', receipt);
  const gameFinishedEvent = receipt.events.find((event: { event: string }) => event.event === 'GameFinished');
  const playerDisqualifiedEvent = receipt.events.find((event: {
    event: string
  }) => event.event === 'PlayerDisqualified');
  return FinishedGameState.fromGameFinishedArgs(gameFinishedEvent.args)
    .addPlayerDisqualified(playerDisqualifiedEvent.args);
};

export const disputeMove = async (
  contract: ethers.Contract,
  signedGameMove: ISignedGameMove,
): Promise<FinishedGameState> => {
  console.log('GameAPI disputeMove: signedGameMove = ', signedGameMove);
  const gasEstimated = await contract.estimateGas.disputeMove(signedGameMove);
  const tx = await contract.disputeMove(signedGameMove, {gasLimit: gasEstimated.mul(2)});
  console.log('GameAPI disputeMove: tx =', tx);
  const receipt = await tx.wait();
  console.log('GameAPI disputeMove: receipt =', receipt);
  const gameFinishedEvent = receipt.events.find((event: { event: string }) => event.event === 'GameFinished');
  const playerDisqualifiedEvent = receipt.events.find((event: {
    event: string
  }) => event.event === 'PlayerDisqualified');
  return FinishedGameState.fromGameFinishedArgs(gameFinishedEvent.args)
    .addPlayerDisqualified(playerDisqualifiedEvent.args);
};


export const checkIsValidMove = async (
  contract: ethers.Contract,
  gameState: TContractGameState,
  playerIngameId: number,
  encodedMove: string,
) => {
  console.log('GameAPI checkIsValidMove: contract address', contract.address)
  console.log(`GameAPI checkIsValidMove: gameState = ${gameState}, playerIngameId = ${playerIngameId}, encodedMove = ${encodedMove}`);
  const response = contract.isValidMove(gameState, playerIngameId, encodedMove);
  console.log('GameAPI checkIsValidMove: response =', response);
  return response;
};

export const transition = async (
  contract: ethers.Contract,
  gameState: TContractGameState,
  playerIngameId: number,
  encodedMove: string,
) => {
  try {
    console.log('GameAPI transition: gameState = ', gameState, 'playerIngameId = ', playerIngameId, 'encodedMove =', encodedMove);
    const response = await contract.transition(gameState, playerIngameId, encodedMove);
    console.log('GameAPI transition: response =', response);
    return response;

  } catch (error) {
    console.log('GameAPI transition: error', error);
  }
};

export const isValidGameMove = async (contract: ethers.Contract, gameMove: IGameMove) => {
  console.log('GameAPI isValidGameMove: contract =', contract, 'gameMove =', gameMove);
  const response = contract.isValidGameMove(gameMove);
  console.log('GameAPI isValidGameMove: response =', await response);
  return response;
};

export const isValidSignedMove = async (
  contract: ethers.Contract,
  signedgameMove: ISignedGameMove,
) => {
  console.log('GameAPI isValidSignedMove: contract = ', contract, 'signedgameMove =', signedgameMove);
  const response = contract.isValidSignedMove(signedgameMove);
  return response;
};

export async function registerSessionAddress(
  contract: ethers.Contract,
  gameId: BigNumber,
  wallet: ethers.Wallet,
): Promise<void> {
  console.log('GameAPI registerSessionAddress: contract:', contract, 'gameId: ', Number(gameId), 'wallet Addres: ', await wallet.getAddress())
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
  isPaid?: boolean,
  txCreatedCallback?: (hash: string) => void,
): Promise<GameProposedEventObject> => {
  console.log('GameAPI proposeGame:', contract, 'rulesContractAddress: ', rulesContractAddress);
  const value = ethers.BigNumber.from(10).pow(18); // 1
  console.log(value);


  const address = await (await getSigner()).getAddress();

  let wallet = await getSessionWallet(address);
  if (!wallet) wallet = createSessionWallet(address);

  console.log('GameAPI proposeGame: seesionWallet = ', wallet);

  const gasEstimated = await contract.estimateGas.proposeGame(rulesContractAddress, []);
  console.log('GameAPI proposeGame: gasEstimated = ', gasEstimated, Number(gasEstimated));
  const tx = contract.proposeGame(rulesContractAddress, [wallet.address], {
    gasLimit: gasEstimated.mul(2),
    value: isPaid ? value : null,
  });
  console.log('GameAPI proposeGame: tx = ', tx);
  const txResult = await tx;
  console.log('GameAPI proposeGame: txResult = ', txResult);
  txCreatedCallback && txCreatedCallback(tx);
  const rc = txResult.wait();
  console.log('GameAPI proposeGame: rc = ', rc);
  const rcResult = await rc;
  console.log('GameAPI proposeGame: rcResult = ', rcResult);
  const event = rcResult.events.find((event: { event: string }) => event.event === 'GameProposed');
  console.log('GameAPI proposeGame: event = ', event, event.args);
  return event.args;
};

export const acceptGame = async (
  contract: ethers.Contract,
  gameId: BigNumber,
  value: string | null = null,
  txCreatedCallback?: (hash: string) => void,
): Promise<GameStartedEventObject> => {
  console.log('GameAPI acceptGame:', contract, '\n gameId =', gameId, Number(gameId));
  const gasEstimated = await contract.estimateGas.acceptGame(gameId, [],
    {value});

  console.log('GameAPI acceptGame: gasEstimated = ', gasEstimated, Number(gasEstimated));
//TODO why const address is declared twice on line 270 and 308
  const address = await (await getSigner()).getAddress();

  let wallet = await getSessionWallet(address);
  if (!wallet) wallet = createSessionWallet(address);

  console.log('GameAPI acceptGame: seesionWallet = ', wallet);

  const tx = contract.acceptGame(gameId, [wallet.address], {
    gasLimit: gasEstimated.mul(2),
    value,
  });
  console.log('GameAPI acceptGame: tx = ', tx);
  const txResult = await tx;
  console.log('GameAPI acceptGame: txResult = ', txResult);
  txCreatedCallback && txCreatedCallback(tx);
  const receipt = txResult.wait();
  console.log('GameAPI acceptGame: receipt = ', receipt);
  const receiptResult = await receipt;
  console.log('GameAPI acceptGame: receiptResult = ', receiptResult);
  const event = receiptResult.events.find((event: { event: string }) => event.event === 'GameStarted');
  console.log('GameAPI acceptGame: event = ', event, event.args);
  return event.args;
};

export const resign = async (
  contract: ethers.Contract,
  gameId: BigNumber,
) => {
  console.log(`GameAPI resign: contract = ${contract} gameId = ${gameId}`);
  const gasEstimated = await contract.estimateGas.resign(gameId);
  const tx = await contract.resign(gameId, {gasLimit: gasEstimated.mul(2)});
  console.log('GameAPI resign: tx = ', tx);
  const receipt = await tx.wait();
  console.log('GameAPI resign: receipt = ', receipt);
  const gameFinishedEvent = receipt.events.find((event: { event: string }) => event.event === 'GameFinished');
  const PlayerResignedEvent = receipt.events.find((event: { event: string }) => event.event === 'PlayerResigned');
  return FinishedGameState.fromGameFinishedArgs(gameFinishedEvent.args)
    .addPlayerResigned(PlayerResignedEvent);
};

export const getPlayers = async (contract: ethers.Contract, gameId: BigNumber) => {
  const _getPlayers = async () => {
    try {
      console.log('GameAPI getPlayers: ', contract, gameId);
      const response = await contract.getPlayers(gameId);
      return response;
    } catch (error) {
      console.error('GameAPI getPlayers error: ', error);
      setTimeout(_getPlayers, 10000);
    }
  }
  return _getPlayers()
};

export default {
  proposeGame,
  acceptGame,
  resign,
  getPlayers,
  disputeMove,
  checkIsValidMove,
  transition,
  isValidGameMove,
};
