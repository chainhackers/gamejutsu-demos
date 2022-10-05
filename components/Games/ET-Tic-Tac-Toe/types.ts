import {
  IGameState,
  IMyGameMove,
  IMyGameBoard,
  TGameHistory,
  TContractGameState as TContractGameState, TPlayer, BaseGameState,
} from '../types';

import { ISignedGameMove } from '../../../types/arbiter';
import { defaultAbiCoder } from 'ethers/lib/utils';


export const TIC_TAC_TOE_STATE_TYPES = ['uint8[9]', 'bool', 'bool'] as const;
export const TIC_TAC_TOE_MOVE_TYPES = ['uint8'] as const;

export type TCellData = null | TPlayer;
export type TCells = [
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

export class TTTMove implements IMyGameMove {
  encodedMove: string;
  move: number;
  player: TPlayer;

  private constructor(encodedMove: string, player: TPlayer) {
    this.encodedMove = encodedMove;
    const m = defaultAbiCoder.decode(TIC_TAC_TOE_MOVE_TYPES, encodedMove) as [number];
    this.move = m[0];
    this.player = player;
  }

  static fromEncoded(encodedMove: string, player: TPlayer): TTTMove {
    return Object.seal(new TTTMove(encodedMove, player));
  }

  static fromMove(move: number, player: TPlayer): TTTMove {
    const encodedMove = defaultAbiCoder.encode(TIC_TAC_TOE_MOVE_TYPES, [move]);
    return Object.seal(new TTTMove(encodedMove, player));
  }
}

export class TicTacToeBoard implements IMyGameBoard<TTTMove> {
  cells: TCells;
  crossesWin: boolean;
  naughtsWin: boolean;

  disputableMoves: Set<number>;


  private constructor(history: TTTMove[] = [],
    crossesWin: boolean = false,
    naughtsWin: boolean = false,
    disputableMoveNonces: Set<number> = new Set()) {
    this.cells = [null, null, null, null, null, null, null, null, null];

    history.forEach((move) => {
      this.cells[move.move] = move.player;
    });

    this.crossesWin = crossesWin;
    this.naughtsWin = naughtsWin;

    this.disputableMoves = history.reduce<Set<number>>(
      (acc: Set<number>, move: TTTMove, i) => {
        if (disputableMoveNonces.has(i)) {
          return acc.add(move.move);
        }
        return acc;
      },
      new Set(),
    );
  }

  getWinner(): TPlayer | null {
    return this.crossesWin ? 'X' : this.naughtsWin ? 'O' : null;
  }

  static fromHistory(history: TTTMove[], disputableMoveNonces: Set<number>): TicTacToeBoard {
    const [crossesWin, naughtsWin] = TicTacToeBoard.winsFromCells(TicTacToeBoard.cellsFromHistory(history));
    return Object.seal(new TicTacToeBoard(history,
      crossesWin,
      naughtsWin,
      disputableMoveNonces));
  }

  static empty(): TicTacToeBoard {
    return Object.seal(new TicTacToeBoard());
  }

  encode(): string {
    const cellsToEncode = this.cells.map((cell) => {
      if (cell === null) { return 0 } else if (cell === 'X') { return 1 } else if (cell === 'O') { return 2 }
    });
    return defaultAbiCoder.encode(TIC_TAC_TOE_STATE_TYPES, [cellsToEncode, this.crossesWin, this.naughtsWin])
  }

  static fromEncoded(encodedState: string): TicTacToeBoard {
    const [cellsToDecode, crossesWin, naughtsWin] = defaultAbiCoder.decode(TIC_TAC_TOE_STATE_TYPES, encodedState) as [
      [number, number, number, number, number, number, number, number, number],
      boolean,
      boolean,
    ];
    const cells = cellsToDecode.map((cell) => {
      if (cell === 1) { return 'X' } else if (cell === 2) { return 'O' }
      return null;
    }) as TCells;
    const board = new TicTacToeBoard([], crossesWin, naughtsWin);
    board.cells = cells;
    return Object.seal(board);
  }

  static cellsFromHistory(history: TTTMove[]): TCells {
    const cells: TCells = [null, null, null, null, null, null, null, null, null];
    history.forEach((move) => {
      cells[move.move] = move.player;
    });
    return cells;
  }

  static winsFromCells(cells: TCells): [boolean, boolean] {
    const xWins = TicTacToeBoard.checkWin(cells, 'X');
    const oWins = TicTacToeBoard.checkWin(cells, 'O');
    return [xWins, oWins];
  }

  static checkWin(cells: TCells, player: TPlayer): boolean {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winConditions.some((condition) => {
      return condition.every((cell) => cells[cell] === player);
    });
  }
}

export class TicTacToeState extends BaseGameState<TicTacToeBoard, TTTMove> implements IGameState<TicTacToeBoard, TTTMove> {

  constructor({ gameId, playerType, board = null }: { gameId: number; playerType: TPlayer; board?: TicTacToeBoard | null; }) {
    super({ gameId, playerType });
    this.currentBoard = board || TicTacToeBoard.empty();
  }

  makeNewGameStateFromSignedMove(signedMove: ISignedGameMove, valid: boolean = true): this {
    const winner = TicTacToeBoard.fromEncoded(signedMove.gameMove.newState).getWinner();
    const move = TTTMove.fromEncoded(signedMove.gameMove.move, this.playerId == 0 ? 'X' : 'O');
    return this.makeNewGameState({
      gameId: signedMove.gameMove.gameId,
      nonce: signedMove.gameMove.nonce,
      state: signedMove.gameMove.newState,
    }, move, valid, winner);
  }

  makeNewGameStateFromOpponentsSignedMove(signedMove: ISignedGameMove, valid: boolean = true): this {
    const winner = TicTacToeBoard.fromEncoded(signedMove.gameMove.newState).getWinner();
    const move = TTTMove.fromEncoded(signedMove.gameMove.move, this.playerId == 0 ? 'O' : 'X');
    return this.makeNewGameState({
      gameId: signedMove.gameMove.gameId,
      nonce: signedMove.gameMove.nonce + 1,
      state: signedMove.gameMove.newState,
    }, move, valid, winner);
  }

  makeNewGameState(
    contractGameState: TContractGameState,
    move: TTTMove,
    valid: boolean = true,
    winner: TPlayer | null = null,
  ): this {
    const nextState = this._makeNewGameState(
      contractGameState, move, valid, winner
    );
    nextState.currentBoard = TicTacToeBoard.fromEncoded(contractGameState.state);
    return Object.freeze(nextState);
  }

  encode(): string {
    this.currentBoard.naughtsWin = this.winner === 1;
    this.currentBoard.crossesWin = this.winner === 0;
    return this.currentBoard.encode();
  }
}
