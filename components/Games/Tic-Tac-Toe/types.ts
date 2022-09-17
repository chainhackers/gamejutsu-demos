export type TCellData = 0 | 1 | 2;

export type TGameBoardState = [
  TCellData,
  TCellData,
  TCellData,
  TCellData,
  TCellData,
  TCellData,
  TCellData,
  TCellData,
  TCellData,
];

export type TGameState = [TGameBoardState, boolean, boolean];
