export interface IPlayer {
  id: string;
}

export type TBoardState = [number[], boolean, boolean];

export interface PlayerI {
  playerName: string;
  address: string | null;
  playerType: string;
  avatarUrl: string;
}
