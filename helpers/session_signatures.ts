import { ethers } from 'ethers';
import { ZERO_ADDRESS } from 'types/constants';
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
  if (!!privateKey) throw new Error(`Private key for address ${address} exists`);
  
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
  playerAddress = ZERO_ADDRESS,
): Promise<string> {
  const signature = await wallet._signTypedData(domain, types, gameMove);
  // START *****FOR DEBUG PURPOSE ONLY. TODO: REMOVE ON PROD****** 
  const storedSignatures = localStorage.getItem('signatures');
  const privateKey = getStoredPrivateKey(playerAddress);
  if (storedSignatures === null) {
    localStorage.setItem('signatures', JSON.stringify({ [signature]: { sessionWalletAddress: wallet.address, privateKey, playerAddress }}))
  } else {
    const parsedStoredSignatures = JSON.parse(storedSignatures);
    parsedStoredSignatures[signature] = { sessionWalletAddress: wallet.address, privateKey, playerAddress };
    localStorage.setItem('signatures', JSON.stringify(parsedStoredSignatures)); 
  }
  // END *****FOR DEBUG PURPOSE ONLY. TODO: REMOVE ON PROD****** 
  return signature;
}

export async function signMoveWithAddress(
    gameMove: IGameMove,
    address: string,
): Promise<string> {
  const wallet = await getSessionWallet(address);
  if (!wallet) throw new Error('SignMove: no private key in local storage')
  return signMove(gameMove, wallet, address);
}
