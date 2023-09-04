import React, { createContext, ReactNode, useContext, useState } from 'react';
import { PlayerI } from '../types/game';

export interface IGameStateContext {
  finishResult: { winner: boolean; isDraw: boolean; cheatWin: boolean } | null;
  setFinishResult: (
    newFinishResult: {
      winner: boolean;
      isDraw: boolean;
      cheatWin: boolean;
    } | null,
  ) => void;
  playerResult: {
    address?: string | null;
    playerType?: React.ReactNode;
    moves?: boolean;
  } | null;
  setPlayerResult: (newPlayerResult: {
    address?: string | null;
    playerType?: React.ReactNode;
    moves?: boolean;
  }) => void;
  // playerTypeResult: React.ReactNode | null;
}

export const GameStateContextDefault: IGameStateContext = {
  finishResult: null,
  setFinishResult: () => {},
  playerResult: null,
  setPlayerResult: () => {}, // playerTypeResult: null,
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
  const [playerResult, setPlayerResult] = useState<{
    address?: string | null;
    playerType?: React.ReactNode;
    moves?: boolean;
  } | null>(null);
  const [playerTypeResult] = useState<ReactNode>(null);
  // TODO NEXT STEP habdevs 02/09/23
  const contextValue: IGameStateContext = {
    finishResult,
    setFinishResult,
    playerResult,
    setPlayerResult,
    // playerTypeResult,
  };
  console.log('CONTEXT setFinishResult', setFinishResult);
  console.log('CONTEXT finishResult', finishResult);
  console.log('CONTEXT setPlayerResult', setPlayerResult);
  console.log('CONTEXT PlayerResult', playerResult);
  return <GameStateContext.Provider value={contextValue}>{children}</GameStateContext.Provider>;
};
