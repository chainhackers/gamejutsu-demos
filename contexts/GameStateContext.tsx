import React, { createContext, ReactNode, useContext, useState } from 'react';
import { PlayerI } from '../types/game';

export interface PlayerInfo {
  playerName: string | null;
  address: string | null;
  playerType?: React.ReactNode;
  moves?: boolean
}
export interface IGameStateContext {
  finishResult: { winner: boolean; isDraw: boolean; cheatWin: boolean } | null;
  setFinishResult: (
    newFinishResult: {
      winner: boolean;
      isDraw: boolean;
      cheatWin: boolean;
    } | null,
  ) => void;
  playerResult: PlayerInfo[]
  setPlayerResult: (newPlayersResult: PlayerInfo[]) => void;
}

export const GameStateContextDefault: IGameStateContext = {
  finishResult: null,
  setFinishResult: () => {},
  playerResult: [],
  setPlayerResult: () => {},
};
export const useGameStateContext = () => useContext(GameStateContext);
export const GameStateContext = createContext<IGameStateContext>(GameStateContextDefault);

export const GameStateContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [finishResult, setFinishResult] = useState<{
    winner: boolean;
    isDraw: boolean;
    cheatWin: boolean;
  } | null>(null);
  const [playerResult, setPlayerResult] = useState<PlayerInfo[]>([]);
  const [playerTypeResult] = useState<ReactNode>(null);
  // TODO NEXT STEP habdevs 02/09/23
  const contextValue: IGameStateContext = {
    finishResult,
    setFinishResult,
    playerResult,
    setPlayerResult,
  };
  console.log('CONTEXT setFinishResult', setFinishResult);
  console.log('CONTEXT finishResult', finishResult);
  console.log('CONTEXT setPlayerResult', setPlayerResult);
  console.log('CONTEXT PlayerResult', playerResult);
  return <GameStateContext.Provider value={contextValue}>{children}</GameStateContext.Provider>;
};
