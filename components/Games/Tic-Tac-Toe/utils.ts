import arbiterContract from 'contracts/arbiter.json';
import rulesContreact from 'contracts/TicTacToeRules.json';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
console.log('arbiter', arbiterContract);

const web3 = new Web3(Web3.givenProvider);

// const parsedContract = JSON.parse(arbiterContact);

export const connectContract = async () => {
  const contract = await new web3.eth.Contract(
    arbiterContract.abi as AbiItem[],
    arbiterContract.address,
  );

  console.log('contract connected', contract);
  console.log(contract.methods.proposeGame);
  return contract;
};

export const connectRulesContract = async () => {
  const contract = await new web3.eth.Contract(
    rulesContreact.abi as AbiItem[],
    rulesContreact.address,
  );

  console.log('contract rules connected', contract);
  console.log(contract.methods.proposeGame);
  return contract;
};

export function calculateWinner(squares: Array<'X' | 'O'>) {
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
    const player = squares[a];
    if (player && player === squares[b] && player === squares[c]) {
      return player;
    }
  }
  return null;
}

interface IGameData {}

export const encode = (data: IGameData) => {};
