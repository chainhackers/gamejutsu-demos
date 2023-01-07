import { BaseGameState, IMyGameBoard, IMyGameMove, TPlayer } from 'components/Games/types';
import { IGameMove } from 'types/arbiter';

class GameMove implements IMyGameMove {
  encodedMove: string;
  constructor(encodedMove: string) {
    this.encodedMove = encodedMove
  }
};

class GameBoard implements IMyGameBoard<GameMove> {
  getWinner(): TPlayer | null {
    return "X"
  }  
}

class GameState extends BaseGameState<GameBoard, GameMove> {
  fromEncodedMove(encodedMove: string, opponentMove: boolean): GameMove {
    return new GameMove('testmove');
  }
  fromEncodedBoard(encodedBoardState: string): GameBoard {
    return new GameBoard();
  }
encode(): string {
  return 'asdfasdfdf';
}
}

export const testGameState0 = new GameState({ gameId: 0, playerType: 'X' });

export const TEST_ADDRESS_0 = '0x0000000000000000000000000000000000000000';
export const TEST_ADDRESS_1 = '0x0000000000000000000000000000000000000001';

export const testGameMove0: IGameMove = {
      gameId: 0,
      nonce: 0,
      player: TEST_ADDRESS_1,
      oldState: '0x0000000000000000000000000000000000000000',
      newState: '0x0000000000000000000000000000000000000000',
      move: '0x0000000000000000000000000000000000000000'
}
    
export const testGameMove1: IGameMove = { 
    gameId: 0, 
    nonce: 0, 
    player: TEST_ADDRESS_0, 
    newState: '0x0000000000000000000000000000000000000000',
    oldState: '0x0000000000000000000000000000000000000000',
    move: '0x0000000000000000000000000000000000000000'
  }