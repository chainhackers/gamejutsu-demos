import React, { createContext, useContext, useState } from 'react'
import { PlayerI } from '../types/game'

export interface IGameStateContext {
  finishResult: { winner: boolean, isDraw: boolean, cheatWin: boolean } | null;
  setFinishResult: (newFinishResult: {
    winner: boolean, isDraw: boolean, cheatWin: boolean
  } | null) => void;
  playerResult: { players: PlayerI[] } | null;
  setPlayerResult: (newPlayerResult: {players: PlayerI[]}) => void;
}

export const GameStateContextDefault: IGameStateContext = {
  finishResult: null,
  setFinishResult: () => {},
  playerResult: null,
  setPlayerResult: () => {},
}
export const useGameStateContext = () => useContext(GameStateContext)
export const GameStateContext = createContext<IGameStateContext>(
  GameStateContextDefault)

export const GameStateContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [finishResult, setFinishResult] = useState<{
    winner: boolean, isDraw: boolean, cheatWin: boolean
  } | null>(null)
  const [playerResult, setPlayerResult] = useState<{ players: PlayerI[] } | null>(null)
  // TODO NEXT STEP habdevs 02/09/23
  const contextValue: IGameStateContext = {
    finishResult, setFinishResult, playerResult, setPlayerResult,
  }
  console.log('CONTEXT setFinishResult', setFinishResult)
  console.log('CONTEXT finishResult', finishResult)
  console.log('CONTEXT setPlayerResult', setPlayerResult)
  console.log('CONTEXT PlayerResult', playerResult)
  return <GameStateContext.Provider
    value={contextValue}>{children}</GameStateContext.Provider>
}

