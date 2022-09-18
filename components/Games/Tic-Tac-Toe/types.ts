export type TCellData = null | 0 | 1;

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
