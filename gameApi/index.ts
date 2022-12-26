import { BigNumber, ethers } from 'ethers';
import { getSessionWallet, signMove } from 'helpers/session_signatures';
import { IGameMove, ISignedGameMove } from '../types/arbiter';
import { TContractGameState } from 'components/Games/types';
import {
  GameProposedEvent,
  GameProposedEventObject,
  GameStartedEventObject,
} from '../.generated/contracts/esm/types/polygon/Arbiter';
import { getPolygonSdk } from '../.generated/contracts';
import { TGameType } from 'types/game';

const getSdk = () => getPolygonSdk(getSigner()!);
export const getArbiter = () => getSdk().arbiter;
export const getRulesContract = (gameType: TGameType): ethers.Contract => {
  if (gameType == 'checkers') {
    return getSdk().checkersRules;
  }
  if (gameType == 'tic-tac-toe') {
    return getSdk().ticTacToeRules;
  }
  throw 'Unknown gameType: ' + gameType;
};

export function getSigner(): ethers.Signer | null {
  console.log('window.ethereum', window.ethereum);
  // const provider =
  //   window.ethereum != null
  //     ? new ethers.providers.Web3Provider(window.ethereum)
  //     : ethers.providers.getDefaultProvider();
  if (!window.ethereum) {
    // const provider = ethers.providers.getDefaultProvider();
    // const signer = provider.getSigner();
    // return signer;
    return null;
  }

  const provider = new ethers.providers.Web3Provider(
    window.ethereum as ethers.providers.ExternalProvider,
  );
  const signer = provider.getSigner();
  return signer;
}

export function newContract(
  addressOrName: string,
  contractInterface: ethers.ContractInterface,
  signerOrProvider?: ethers.Signer | ethers.providers.Provider,
): ethers.Contract {
  const contract = new ethers.Contract(addressOrName, contractInterface, signerOrProvider);
  return contract;
}

// event GameProposed(address indexed rules, uint256 gameId, uint256 stake, address indexed proposer);
// event GameStarted(address indexed rules, uint256 gameId, uint256 stake, address[2] players);

// event GameFinished(uint256 gameId, address winner, address loser, bool isDraw);
// event PlayerDisqualified(uint256 gameId, address player);
// event PlayerResigned(uint256 gameId, address player);

// event SessionAddressRegistered(uint256 gameId, address player, address sessionAddress);
// event TimeoutStarted(uint256 gameId, address player, uint256 nonce, uint256 timeout);
// event TimeoutResolved(uint256 gameId, address player, uint256 nonce);

type TGameFinished = { gameId: number; winner: string; loser: string; isDraw: boolean };
type TPlayerDisqualified = { gameId: number; player: string };
type TPlayerResigned = { gameId: number; player: string };

export class FinishedGameState {
  gameId: number;
  winner: string | null;
  loser: string | null;
  isDraw: boolean;
  disqualified: string | null;
  resigned: string | null;

  constructor(
    gameId: number,
    winner: string | null = null,
    loser: string | null = null,
    isDraw: boolean,
    disqualified: string | null = null,
    resigned: string | null = null,
  ) {
    this.gameId = gameId;
    this.winner = winner;
    this.loser = loser;
    this.isDraw = isDraw;
    this.disqualified = disqualified;
    this.resigned = resigned;
  }
  static fromGameFinishedArgs(gameFinished: TGameFinished) {
    return new FinishedGameState(
      gameFinished.gameId,
      gameFinished.winner,
      gameFinished.loser,
      gameFinished.isDraw,
    );
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
  console.log('signedGameMoves', signedGameMoves);
  const gasEstimated = await contract.estimateGas.finishGame(signedGameMoves);
  const tx = await contract.finishGame(signedGameMoves, { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const gameFinishedEvent = rc.events.find(
    (event: { event: string }) => event.event === 'GameFinished',
  );
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
  console.log('signedGameMoves', signedGameMoves);
  const value = ethers.BigNumber.from(10).pow(17);
  const gasEstimated = await contract.estimateGas.initTimeout(signedGameMoves, { value });
  const tx = await contract.initTimeout(signedGameMoves, {
    value,
    gasLimit: gasEstimated.mul(2),
  });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const event = rc.events.find((event: { event: string }) => event.event === 'TimeoutStarted');
  return { ...event.args };
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
  console.log('signedGameMove', signedGameMove);
  const gasEstimated = await contract.estimateGas.resolveTimeout(signedGameMove);
  const tx = await contract.resolveTimeout(signedGameMove, { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const event = rc.events.find(
    (event: { event: string }) => event.event === 'TimeoutResolved',
  );
  return { ...event.args };
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
  const tx = await contract.finalizeTimeout(gameId, { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const gameFinishedEvent = rc.events.find(
    (event: { event: string }) => event.event === 'GameFinished',
  );
  const playerDisqualifiedEvent = rc.events.find(
    (event: { event: string }) => event.event === 'PlayerDisqualified',
  );
  return FinishedGameState.fromGameFinishedArgs(gameFinishedEvent.args).addPlayerDisqualified(
    playerDisqualifiedEvent.args,
  );
};

export const disputeMove = async (
  contract: ethers.Contract,
  signedGameMove: ISignedGameMove,
): Promise<FinishedGameState> => {
  const gasEstimated = await contract.estimateGas.disputeMove(signedGameMove);
  const tx = await contract.disputeMove(signedGameMove, { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const gameFinishedEvent = rc.events.find(
    (event: { event: string }) => event.event === 'GameFinished',
  );
  const playerDisqualifiedEvent = rc.events.find(
    (event: { event: string }) => event.event === 'PlayerDisqualified',
  );
  return FinishedGameState.fromGameFinishedArgs(gameFinishedEvent.args).addPlayerDisqualified(
    playerDisqualifiedEvent.args,
  );
};

export const checkIsValidMove = async (
  contract: ethers.Contract,
  gameState: TContractGameState,
  playerIngameId: number,
  encodedMove: string,
) => {
  console.log('checkIsValidMove', { gameState, playerIngameId, encodedMove });
  const response = contract.isValidMove(gameState, playerIngameId, encodedMove);
  console.log('response', response);
  return response;
};

export const transition = async (
  contract: ethers.Contract,
  gameState: TContractGameState,
  playerIngameId: number,
  encodedMove: string,
) => {
  console.log('transition', { gameState, playerIngameId, encodedMove });
  const response = await contract.transition(gameState, playerIngameId, encodedMove);
  console.log('response', response);
  return response;
};

export const isValidGameMove = async (contract: ethers.Contract, gameMove: IGameMove) => {
  console.log('isValidGameMove', { contract, gameMove });
  const response = contract.isValidGameMove(gameMove);
  console.log({ response });
  return response;
};

export const isValidSignedMove = async (
  contract: ethers.Contract,
  gameMove: IGameMove,
  signatures: string[] = [],
) => {
  let wallet = await getSessionWallet(await getSigner()!.getAddress());
  let signature: string = await signMove(gameMove, wallet);
  signatures.push(signature);
  return _isValidSignedMove(contract, { gameMove, signatures });
};

export const _isValidSignedMove = async (
  contract: ethers.Contract,
  signedgameMove: ISignedGameMove,
) => {
  console.log('isValidSignedMove', { contract, signedgameMove });
  const response = contract.isValidSignedMove(signedgameMove);
  return response;
};

export async function registerSessionAddress(
  contract: ethers.Contract,
  gameId: BigNumber,
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
  isPaid?: boolean,
): Promise<GameProposedEventObject> => {
  console.log('proposeGame', { contract, rulesContractAddress });
  const value = ethers.BigNumber.from(10).pow(16);
  let wallet = await getSessionWallet(await getSigner()!.getAddress());
  const gasEstimated = await contract.estimateGas.proposeGame(rulesContractAddress, []);

  const tx = await contract.proposeGame(rulesContractAddress, [wallet.address], {
    gasLimit: gasEstimated.mul(2),
    value: isPaid ? value : null,
  });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const event = rc.events.find((event: { event: string }) => event.event === 'GameProposed');
  return event.args;
};

export const acceptGame = async (
  contract: ethers.Contract,
  gameId: BigNumber,
  value: string | null = null,
): Promise<GameStartedEventObject> => {
  const gasEstimated = await contract.estimateGas.acceptGame(gameId, [], { value });
  let wallet = await getSessionWallet(await getSigner()!.getAddress());
  const tx = await contract.acceptGame(gameId, [wallet.address], {
    gasLimit: gasEstimated.mul(2),
    value,
  });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const event = rc.events.find((event: { event: string }) => event.event === 'GameStarted');
  return event.args;
};

export const resign = async (contract: ethers.Contract, gameId: BigNumber) => {
  const gasEstimated = await contract.estimateGas.resign(gameId);
  const tx = await contract.resign(gameId, { gasLimit: gasEstimated.mul(2) });
  console.log('tx', tx);
  const rc = await tx.wait();
  console.log('rc', rc);
  const gameFinishedEvent = rc.events.find(
    (event: { event: string }) => event.event === 'GameFinished',
  );
  const PlayerResignedEvent = rc.events.find(
    (event: { event: string }) => event.event === 'PlayerResigned',
  );
  return FinishedGameState.fromGameFinishedArgs(gameFinishedEvent.args).addPlayerResigned(
    PlayerResignedEvent,
  );
};

export const getPlayers = async (contract: ethers.Contract, gameId: BigNumber) => {
  const response = contract.getPlayers(gameId);
  return response;
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
