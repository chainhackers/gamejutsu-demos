import { describe, expect, test } from '@jest/globals';
import { ethers } from 'ethers';
import { getSessionWallet } from 'helpers/session_signatures';

describe('session wallet', () => {
  const TEST_ADDRESS_0 = '0x0000000000000000000000000000000000000000';
  const localStorage = window.localStorage;
  const privateStore = `${TEST_ADDRESS_0}_private`;

  test('no private key in localStorage', async () => {
    const privateKey = localStorage.getItem(privateStore);

    expect(privateKey).toBeNull();
    expect(async () => await getSessionWallet(TEST_ADDRESS_0)).rejects.toThrowError();  
  })

  test('private key set to localStorage', async () => {
    const wallet = ethers.Wallet.createRandom();
    localStorage.setItem(privateStore, wallet.privateKey);
    const privateKey = localStorage.getItem(privateStore);

    expect(privateKey).not.toBeNull();
    expect(await getSessionWallet(TEST_ADDRESS_0)).toBeInstanceOf(ethers.Wallet)
  })
})