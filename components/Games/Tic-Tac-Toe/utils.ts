import arbiterContract from 'contracts/Arbiter.json';
import rulesContreact from 'contracts/TicTacToeRules.json';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { TGameBoardState } from './types';
const web3 = new Web3(Web3.givenProvider);

// const parsedContract = JSON.parse(arbiterContact);

export const connectContract = async () => {
  const contract = await new web3.eth.Contract(
    arbiterContract.abi as AbiItem[],
    arbiterContract.address,
  );

  return contract;
};

export const connectRulesContract = async () => {
  const contract = await new web3.eth.Contract(
    rulesContreact.abi as AbiItem[],
    rulesContreact.address,
  );
  return contract;
};

export function calculateWinner(boardState: TGameBoardState) {
  console.log('calc winnder', 'state', boardState);
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const length = lines.length;
  for (let i = 0; i < length; i++) {
    const [a, b, c] = lines[i];
    const player = boardState[a];
    if (player !== null && player === boardState[b] && player === boardState[c]) {
      return player;
    }
  }
  return null;
}
