import { describe, expect, test } from '@jest/globals';
import { ethers } from 'ethers';
import { SignedGameMove } from 'types/arbiter';
import { testGameState0 as testGameState, TEST_ADDRESS_1, testGameMove1 } from '__fixtures__/testGame';

const localStorage = window.localStorage;
const privateStore = `${TEST_ADDRESS_1}_private`;

describe('game state', () => {
  test('no session private key in localStorage', async () => {
    const privateKey = localStorage.getItem(privateStore);
    expect(privateKey).toBeNull();
    expect(async () => await testGameState.signMove(testGameMove1, TEST_ADDRESS_1)).rejects.toThrowError('Can not get wallet: no private key');
    
  })
  test('with session private key in localStorage', async () => {
    const wallet = ethers.Wallet.createRandom();
    localStorage.setItem(privateStore, wallet.privateKey);
    const privateKey = localStorage.getItem(privateStore);
    expect(privateKey).not.toBeNull();
    const signedMove = await testGameState.signMove(testGameMove1, TEST_ADDRESS_1);
    expect(signedMove).toBeInstanceOf(SignedGameMove)
  })
})
