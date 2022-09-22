import { ethers } from 'ethers';
import {GameMove, IGameMove} from "../types/arbiter";

export async function getSessionWallet(
  address: string,
): Promise<ethers.Wallet> {
  console.log(`Waller requested for address ${address}`);
  let localStorage = window.localStorage;
  let privateStore = `${address}_private`;
  let privateKey = localStorage.getItem(privateStore);
  if (privateKey) {
    return new ethers.Wallet(privateKey);
  }
  let wallet = ethers.Wallet.createRandom();
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
  let signPromise = wallet._signTypedData(domain, types, gameMove);
  console.log({signPromise});
  return signPromise;
}

export async function signMoveWithAddress(
    gameMove: IGameMove,
    address: string,
): Promise<string> {
  return signMove(gameMove, await getSessionWallet(address));
}
