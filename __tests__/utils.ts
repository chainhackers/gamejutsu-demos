import { describe, expect, test } from '@jest/globals';
import { TPlayer } from 'components/Games/types';
import { defaultAbiCoder } from 'ethers/lib/utils';
import {
  CHECKERSMove,
  TCheckersContractMove,
  CHECKERS_MOVE_TYPES,
} from '../components/Games/Checkers/types';

function getEncodedMove(moveTypes: string[], move: TCheckersContractMove) {
  return defaultAbiCoder.encode(moveTypes, move);
}

const move1: { move: TCheckersContractMove; player: TPlayer } = {
  move: [9, 13, true],
  player: 'X',
};

const move8: { move: TCheckersContractMove; player: TPlayer } = {
  move: [23, 18, false],
  player: 'O',
};

const move9: { move: TCheckersContractMove; player: TPlayer } = {
  move: [10, 4, false],
  player: 'X',
};

const move10: { move: TCheckersContractMove; player: TPlayer } = {
  move: [21, 21, false],
  player: 'O',
};

describe('CHECKERSMove.fromMove', () => {
  test('move from 9 to 13, passMoveToOpponent: true, player: X', () => {
    const move1: { move: TCheckersContractMove; player: TPlayer } = {
      move: [9, 13, true],
      player: 'X',
    };
    expect(CHECKERSMove.fromMove(move1.move, move1.player).encodedMove).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000009' +
        '000000000000000000000000000000000000000000000000000000000000000d' +
        '0000000000000000000000000000000000000000000000000000000000000001'
    );
  });
  test('move from 9 to 28, passMoveToOpponent: true, player X', () => {
    const move2: { move: TCheckersContractMove; player: TPlayer } = {
      move: [9, 28, true],
      player: 'X',
    };
    expect(CHECKERSMove.fromMove(move2.move, move2.player).encodedMove).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000009' +
        '000000000000000000000000000000000000000000000000000000000000001c' +
        '0000000000000000000000000000000000000000000000000000000000000001'
    );
  });
  test('move from 3 to 4, passMoveToOpponent: false, player X', () => {
    const move3: { move: TCheckersContractMove; player: TPlayer } = {
      move: [3, 4, false],
      player: 'X',
    };
    expect(CHECKERSMove.fromMove(move3.move, move3.player).encodedMove).toBe(
      getEncodedMove(CHECKERS_MOVE_TYPES, move3.move)
    );
    ('0x0000000000000000000000000000000000000000000000000000000000000003' +
    '0000000000000000000000000000000000000000000000000000000000000004' +
    '0000000000000000000000000000000000000000000000000000000000000000');
  });
  test('move from 13 to 9, passMoveToOpponent: false, player O', () => {
    const move4: { move: TCheckersContractMove; player: TPlayer } = {
      move: [13, 9, false],
      player: 'O',
    };
    expect(CHECKERSMove.fromMove(move4.move, move4.player).encodedMove).toBe(
      '0x000000000000000000000000000000000000000000000000000000000000000d' +
      '0000000000000000000000000000000000000000000000000000000000000009' +
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
  });
  test('move from 5 to 12, passMoveToOpponent: true, player: X', () => {
    const move5: { move: TCheckersContractMove; player: TPlayer } = {
      move: [5, 12, true],
      player: 'X',
    };
    expect(CHECKERSMove.fromMove(move5.move, move5.player).encodedMove).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000005' +
      '000000000000000000000000000000000000000000000000000000000000000c' +
      '0000000000000000000000000000000000000000000000000000000000000001'
    );
  });
  test('move from 19 to 17, passMoveToOpponent: true, player X', () => {
    const move6: { move: TCheckersContractMove; player: TPlayer } = {
      move: [19, 17, true],
      player: 'X',
    };
    expect(CHECKERSMove.fromMove(move6.move, move6.player).encodedMove).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000013' +
      '0000000000000000000000000000000000000000000000000000000000000011' +
      '0000000000000000000000000000000000000000000000000000000000000001'
    );
  });
  test('move from 3 to 5, passMoveToOpponent: false, player X', () => {
    const move7: { move: TCheckersContractMove; player: TPlayer } = {
      move: [3, 5, false],
      player: 'X',
    };
    expect(CHECKERSMove.fromMove(move7.move, move7.player).encodedMove).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000003' +
      '0000000000000000000000000000000000000000000000000000000000000005' +
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
  });
  test('move from 23 to 18, passMoveToOpponent: false, player O', () => {
    expect(CHECKERSMove.fromMove(move8.move, move8.player).encodedMove).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000017' +
      '0000000000000000000000000000000000000000000000000000000000000012' +
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
  });
  test('move from 10 to 4, passMoveToOpponent: false, player X', () => {
    expect(CHECKERSMove.fromMove(move9.move, move9.player).encodedMove).toBe(
      '0x000000000000000000000000000000000000000000000000000000000000000a' +
      '0000000000000000000000000000000000000000000000000000000000000004' +
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
  });
  test('move from 21 to 21, passMoveToOpponent: false, player O', () => {
    expect(CHECKERSMove.fromMove(move10.move, move10.player).encodedMove).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000015' +
      '0000000000000000000000000000000000000000000000000000000000000015' +
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
  });
});
