import { AbiItem } from 'web3-utils';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);

export const connectContract = async (abi: AbiItem[], address: string) => {
  const contract = await new web3.eth.Contract(abi as AbiItem[], address);
  return contract;
};
