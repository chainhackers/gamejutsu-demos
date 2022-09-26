import {
  IGameState,
  IMyGameMove,
  IMyGameState,
  TGameHistory,
  TGameStateContractParams, TPlayer,
} from '../types';
import { GameMove, IGameMove, ISignedGameMove, SignedGameMove } from '../../../types/arbiter';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { signMoveWithAddress } from '../../../helpers/session_signatures';

const STATE_TYPES = ['uint8[9]', 'bool', 'bool'] as const;
const MOVE_TYPES = ['uint8'] as const;

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
    const m = defaultAbiCoder.decode(MOVE_TYPES, encodedMove) as [number];
    this.move = m[0];
    this.player = player;
  }

  static fromEncoded(encodedMove: string, player: TPlayer): TTTMove {
    return Object.seal(new TTTMove(encodedMove, player));
  }

  static fromMove(move: number, player: TPlayer): TTTMove {
    const encodedMove = defaultAbiCoder.encode(MOVE_TYPES, [move]);
    return Object.seal(new TTTMove(encodedMove, player));
  }
}

export class TicTacToeBoard implements IMyGameState<TTTMove> {
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
          if (cell === null) {return 0} else if (cell === 'X') {return 1} else if (cell === 'O') {return 2}
      });
    return defaultAbiCoder.encode(STATE_TYPES, [cellsToEncode, this.crossesWin, this.naughtsWin])
  }

  static fromEncoded(encodedState: string): TicTacToeBoard {
    const [cellsToDecode, crossesWin, naughtsWin] = defaultAbiCoder.decode(STATE_TYPES, encodedState) as [
      number[],
      boolean,
      boolean,
    ];
    const cells = cellsToDecode.map((cell) => {
        if (cell === 0) {return null} else if (cell === 1) {return 'X'} else if (cell === 2) {return 'O'}
    });
    return Object.seal(new TicTacToeBoard([], crossesWin, naughtsWin));
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

export function decodeEncodedBoardState(encodedBoardState:string){
    return defaultAbiCoder.decode(STATE_TYPES, encodedBoardState);
}

export function getWinnerFromEncodedState(state: string):TPlayer|null {
    const [_, xWins, oWins] = decodeEncodedBoardState(state);
    let winner: TPlayer | null = null;
    if (xWins) {
        winner = 'X';
    }
    else if (oWins) {
        winner = 'O';
    }
    console.log('winner', winner);
    return winner;
}

export class TicTacToeState implements IGameState<TicTacToeBoard, TTTMove> {
  movesHistory: TGameHistory = [];
  decodedMovesHistory: TTTMove[] = [];
  disputableMoveNumbers: Set<number> = new Set();
  lastMove: ISignedGameMove | null = null;
  lastOpponentMove: ISignedGameMove | null = null;
  isFinished: boolean = false;
  winner: number | null = null;
  gameId: number;
  isMyTurn: boolean;
  myGameState: TicTacToeBoard;
  playerType: TPlayer;
  playerId: number;
  nonce: number = 0;

  constructor(gameId: number, playerType: TPlayer, board: TicTacToeBoard | null = null) {
    this.gameId = gameId;
    this.isMyTurn = playerType === 'X';
    this.myGameState = board || TicTacToeBoard.empty();
    this.playerType = playerType;
    this.playerId = playerType === 'X' ? 0 : 1;
  }

  encodedSignedMove(signedMove: ISignedGameMove, valid: boolean = true): TicTacToeState {
    const winner = getWinnerFromEncodedState(signedMove.gameMove.newState);
    const move = TTTMove.fromEncoded(signedMove.gameMove.move, this.playerId == 0 ? 'X' : 'O');
    return this.makeMove(move, valid, winner);
  }

  opponentSignedMove(signedMove: ISignedGameMove, valid: boolean = true): TicTacToeState {
    const winner = getWinnerFromEncodedState(signedMove.gameMove.newState);
    const move = TTTMove.fromEncoded(signedMove.gameMove.move, this.playerId == 0 ? 'O' : 'X'); //TODO reversed, remove hack
    return this.makeMove(move, valid);
  }

  makeMove(
    move: TTTMove,
    valid: boolean = true,
    winner: TPlayer | null = null,
  ): TicTacToeState {
    //TODO it should be copy constructor, at least for lastMove and lastOpponentMove
    const nextState = new TicTacToeState(this.gameId, this.playerType);
    if (winner) {
      if (winner == this.playerType) {
        nextState.winner = this.playerId;
      } else {
        nextState.winner = 1 - this.playerId;
      }
    }
    nextState.nonce = this.nonce + 1;
    nextState.decodedMovesHistory = [...this.decodedMovesHistory, move];
    const nextDisputableMoveNonces = new Set(this.disputableMoveNumbers);

    if (!valid) {
      nextDisputableMoveNonces.add(this.nonce);
    }

    nextState.disputableMoveNumbers = nextDisputableMoveNonces;
    nextState.myGameState = TicTacToeBoard.fromHistory(
      nextState.decodedMovesHistory,
      nextState.disputableMoveNumbers,
    );
    return Object.seal(nextState);
  }

  encodedMove(encodedMove: string, valid: boolean = true): TicTacToeState {
    const move = TTTMove.fromEncoded(encodedMove, this.playerId == 0 ? 'X' : 'O');
    return this.makeMove(move, valid);
  }

  opponentMove(encodedMove: string, valid: boolean = true): TicTacToeState {
    const move = TTTMove.fromEncoded(encodedMove, this.playerId == 0 ? 'O' : 'X'); //TODO reversed, remove hack
    return this.makeMove(move, valid);
  }

  //TODO deduplicate
  composeMove(move: TTTMove, playerAddress: string): IGameMove {
    return new GameMove(
      this.gameId,
      this.nonce,
      playerAddress,
      this.encode(),
      this.makeMove(move).encode(),
      move.encodedMove,
    );
  }

  async signMove(
    move: TTTMove,
    playerAddress: string,
    winner: TPlayer | null,
  ): Promise<ISignedGameMove> {
    const gameMove = new GameMove(
      this.gameId,
      this.nonce,
      playerAddress,
      this.encode(),
      this.makeMove(move, undefined, winner).encode(),
      move.encodedMove,
    );
    const signature = await signMoveWithAddress(gameMove, playerAddress);
    return new SignedGameMove(gameMove, [signature]);
  }

  toGameStateContractParams(): TGameStateContractParams {
    return { gameId: this.gameId, nonce: this.nonce, state: this.encode() };
  }

  encode(): string {
    this.myGameState.naughtsWin = this.winner === 1;
    this.myGameState.crossesWin = this.winner === 0;
    return this.myGameState.encode();
  }
}
