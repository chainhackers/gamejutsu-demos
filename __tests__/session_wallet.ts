import { describe, expect, test } from '@jest/globals';
import { ethers } from 'ethers';
import { getSessionWallet, signMoveWithAddress, createSessionWallet } from 'helpers/session_signatures';
import { testGameMove0, TEST_ADDRESS_0 } from '__fixtures__/testGame';

const localStorage = window.localStorage;
const privateStore = `${TEST_ADDRESS_0}_private`;

beforeEach(() => {
  window.localStorage.clear();
})
describe('session wallet', () => {
  test('no private key in localStorage', async () => {
    const privateKey = localStorage.getItem(privateStore);
    expect(privateKey).toBeNull();
    expect(await getSessionWallet(TEST_ADDRESS_0)).toBeNull();  
  })

  test('private key set to localStorage', async () => {
    const wallet = ethers.Wallet.createRandom();
    localStorage.setItem(privateStore, wallet.privateKey);
    const privateKey = localStorage.getItem(privateStore);

    expect(privateKey).not.toBeNull();
    expect(await getSessionWallet(TEST_ADDRESS_0)).toBeInstanceOf(ethers.Wallet)
  })
})

describe('sign move with address', () => {
  test('exception if no private key for session wallet', async () => {
    const privateKey = localStorage.getItem(privateStore);
    expect(privateKey).toBeNull();
    expect(async () => await signMoveWithAddress(testGameMove0, TEST_ADDRESS_0)).rejects.toThrow('Can not get wallet: no private key');
  })
  
  test('get signed move', async () => {
    const wallet = ethers.Wallet.createRandom();
    localStorage.setItem(privateStore, wallet.privateKey);
    const privateKey = localStorage.getItem(privateStore);

    expect(privateKey).not.toBeNull();
    expect(typeof (await signMoveWithAddress(testGameMove0, TEST_ADDRESS_0) )).toBe('string');
  })
});

describe('create session wallet', () => {
  test('if localstorage has private key', () => {
    const wallet = ethers.Wallet.createRandom();
    localStorage.setItem(privateStore, wallet.privateKey);
    const privateKey = localStorage.getItem(privateStore);
    expect(privateKey).not.toBeNull();
    expect( () => createSessionWallet(TEST_ADDRESS_0)).toThrow('Private key exists');
  })

  test('if localstorage has no private key', () => {
    const privateKey = localStorage.getItem(privateStore);
    expect(privateKey).toBeNull();
    const wallet = createSessionWallet(TEST_ADDRESS_0);
    expect(wallet).toBeInstanceOf(ethers.Wallet)
  })

})
