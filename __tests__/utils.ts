import { describe, expect, test } from '@jest/globals';
import { CHECKERSMove } from '../components/Games/Checkers/types';
// import { defaultAbiCoder } from 'ethers/lib/utils';

const move1: any = { move: [9, 13, true], player: 'X' };
function isMoveCorrect(move1: any) {
  const move: CHECKERSMove = CHECKERSMove.fromMove(move1.move, move1.player);
  return move;
}

describe('isMoveCorrect', () => {
  test('move from 9 to 13', () => {
    expect(isMoveCorrect(move1).encodedMove).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000d0000000000000000000000000000000000000000000000000000000000000001'
    );
  });
});
