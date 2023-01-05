import { ethers } from 'ethers';
import {IGameMove} from "../types/arbiter";

export async function getSessionWallet(
  address: string,
): Promise<ethers.Wallet> {
  console.log(`Wallet requested for address ${address}`);
  const localStorage = window.localStorage;
  
  const privateStore = `${address}_private`;
  
  const privateKey = localStorage.getItem(privateStore);
  
  if (!privateKey) {
    throw new Error(`No private key, key value: ${String(privateKey)}`)
  }
  if (!!privateKey) { 
    return new ethers.Wallet(privateKey);
  }
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
  return signMove(gameMove, await getSessionWallet(address));
}
