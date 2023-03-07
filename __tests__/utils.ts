import { describe, expect, test } from '@jest/globals';
import { TLastMove } from 'types/game';
// TODO @ghUserrrr #144 Delete 'isJump' field
// import { isJumpMove } from 'helpers/utils';

const bottomLeftCornerMoves: TLastMove[] = [{ from: 3, to: 7 }]
const bottomLeftCornerJumpMoves: TLastMove[] = [
  { from: 3, to: 2 },
  { from: 3, to: 11 },
  { from: 3, to: 10 },
  { from: 3, to: 17 },
];
const bottomRightCornerMoves: TLastMove[] = [
  { from: 0, to: 4 },
  { from: 0, to: 5 },
];
const bottomRightCornerJumpMoves: TLastMove[] = [
  { from: 0, to: 9 },
  { from: 0, to: 18 },
  { from: 0, to: 8 },
  { from: 0, to: 6 },
];

const topLeftCornerMoves: TLastMove[] = [
  {from: 31, to: 27},
  {from: 31, to: 26},
];
const topLeftCornerJumpMoves: TLastMove[] = [
  {from: 31, to: 22},
  {from: 31, to: 23},
  {from: 31, to: 25},
  {from: 31, to: 13},
];
const topRightCornerMoves: TLastMove[] = [
  {from: 28, to: 24},  
];
const topRightCornerJumpMoves: TLastMove[] = [
  {from: 28, to: 21},  
  {from: 28, to: 14},  
  {from: 28, to: 29},  
  {from: 28, to: 20},  
];

// TODO @ghUserrrr #144 Delete 'isJump' field
// describe('isJumpMove', () => {
//   test('bottom left corner, not jump moves', () => {
//     bottomLeftCornerMoves.map(move => {
//       expect(isJumpMove(move)).toBe(false);
//     })
//   })
//   test('bottom left corner, jump moves', () => {
//     bottomLeftCornerJumpMoves.map(move => {
//       expect(isJumpMove(move)).toBe(true);
//     })
//   })
//   test('bottom right corner, not jump moves', () => {
//     bottomRightCornerMoves.map(move => {
//       expect(isJumpMove(move)).toBe(false);
//     })
//   })
//   test('bottom right corner, jump moves', () => {
//     bottomRightCornerJumpMoves.map(move => {
//       expect(isJumpMove(move)).toBe(true);
//     })
//   })
//   test('top left corner, not jump moves', () => {
//     topLeftCornerMoves.map(move => {
//       expect(isJumpMove(move)).toBe(false);
//     })
//   })
//   test('top left corner, jump moves', () => {
//     topLeftCornerJumpMoves.map(move => {
//       expect(isJumpMove(move)).toBe(true);
//     })
//   })
//   test('top right corner, not jump moves', () => {
//     topRightCornerMoves.map(move => {
//       expect(isJumpMove(move)).toBe(false);
//     })
//   })
//   test('top right corner, jump moves', () => {
//     topRightCornerJumpMoves.map(move => {
//       expect(isJumpMove(move)).toBe(true);
//     })
//   })
// });
