export type TGameType = 'tic-tac-toe' | 'checkers'
export interface IPlayer {
  id: string;
}

export type TBoardState = [number[], boolean, boolean];

export interface PlayerI {
  playerName: string;
  address: string | null;
  playerType: React.ReactNode;
  avatarUrl: string;
  moves?: boolean;
}

export type TLastMove = {
    from: number;
    to: number;
} | null;