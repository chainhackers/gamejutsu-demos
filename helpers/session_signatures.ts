import { ethers } from 'ethers';
import {IGameMove} from "../types/arbiter";

export const getStoredPrivateKey = (address: string): string | null => {
  const localStorage = window.localStorage;
  const privateStore = `${address}_private`;
  return localStorage.getItem(privateStore);
} 

export async function getSessionWallet(
  address: string,
): Promise<ethers.Wallet | null> {
  console.log(`Wallet requested for address ${address}`);
  const privateKey = getStoredPrivateKey(address);
  if (!privateKey) return null;
  return new ethers.Wallet(privateKey);
}

export const createSessionWallet = (address: string): ethers.Wallet => {
  const privateKey = getStoredPrivateKey(address);
  if (!!privateKey) throw new Error('Private key exists');
  
  const privateStore = `${address}_private`;
  const localStorage = window.localStorage;
  const wallet = ethers.Wallet.createRandom();
  localStorage.setItem(privateStore, wallet.privateKey);
  return wallet;
}

const domain = {
  name: 'GameJutsu',
  version: '0.1',
  chainId: 137,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  salt: '0x920dfa98b3727bbfe860dd7341801f2e2a55cd7f637dea958edfc5df56c35e4d',
};

const types = {
  GameMove: [
    { name: 'gameId', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'player', type: 'address' },
    { name: 'oldState', type: 'bytes' },
    { name: 'newState', type: 'bytes' },
    { name: 'move', type: 'bytes' },
  ],
};

export async function signMove(
  gameMove: IGameMove,
  wallet: ethers.Wallet,
): Promise<string> {
  const signPromise = wallet._signTypedData(domain, types, gameMove);
  return signPromise;
}

export async function signMoveWithAddress(
    gameMove: IGameMove,
    address: string,
): Promise<string> {
  const wallet = await getSessionWallet(address);
  if (!wallet) throw new Error('Can not get wallet: no private key')
  
  return signMove(gameMove, wallet);
}
