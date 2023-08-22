import React, {createContext, useContext, useMemo, useState} from "react";

export interface IGameStateContext {
  finishResult: { winner: boolean, isDraw: boolean, cheatWin: boolean } | null;
  setFinishResult: (result: { winner: boolean, isDraw: boolean, cheatWin: boolean } | null) => void;

}

export const GameStateContextDefault: IGameStateContext = {
  finishResult: null,
  setFinishResult: () => {
  }
}

export const GameStateContext  = createContext<IGameStateContext>(GameStateContextDefault);
export const useGameStateContext = () => useContext(GameStateContext);
export const GameStateContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [finishResult, setFinishResult] = useState<IGameStateContext["finishResult"] | null>(null);

  const contextValue = useMemo(() => ({ finishResult, setFinishResult }), [finishResult, setFinishResult]);

  return <GameStateContext.Provider value={contextValue}>{children}</GameStateContext.Provider>;
}


// export interface IGameStateContext {
//   finishGameCheckResult: null | { winner: boolean; isDraw: boolean; cheatWin: boolean };
//   finishedGameState: FinishedGameState | null;
//   playerIngameId: 0 | 1;
//   winner: string | null;
//   loser: string | null;
//   isDraw: boolean;
//   disqualified: string | null;
//   resigned: string | null;
//   players: PlayerI[];
//   setFinishGameCheckResult: React.Dispatch<React.SetStateAction<null | {
//     winner: boolean;
//     isDraw: boolean;
//     cheatWin: boolean
//   }>>;
//   setFinishedGameState: React.Dispatch<React.SetStateAction<FinishedGameState | null>>;
//   setGameId: React.Dispatch<React.SetStateAction<number>>;
//   setWinner: React.Dispatch<React.SetStateAction<string | null>>;
//   setLoser: React.Dispatch<React.SetStateAction<string | null>>;
//   setIsDraw: React.Dispatch<React.SetStateAction<boolean>>;
//   setDisqualified: React.Dispatch<React.SetStateAction<string | null>>;
//   setResigned: React.Dispatch<React.SetStateAction<string | null>>;
//   setPlayers: React.Dispatch<React.SetStateAction<PlayerI[] | null>>;
//   setPlayerIngameId: React.Dispatch<React.SetStateAction<0 | 1>>;
//   gameType: string | number;
// }
//
// export const GameStateContextDefault: IGameStateContext = {
//   finishGameCheckResult: null,
//   finishedGameState: null,
//   playerIngameId: 0,
//   winner: null,
//   loser: null,
//   isDraw: false,
//   disqualified: null,
//   resigned: null,
//   players: [],
//   setFinishGameCheckResult: () => {
//   },
//   setFinishedGameState: () => {
//   },
//   setGameId: () => {
//   },
//   setWinner: () => {
//   },
//   setLoser: () => {
//   },
//   setIsDraw: () => {
//   },
//   setDisqualified: () => {
//   },
//   setResigned: () => {
//   },
//   setPlayers: () => {
//   },
//   setPlayerIngameId: () => {
//   },
//   gameType: 0
// }

// export const GameStateContextProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
//   const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);
//   const [players, setPlayers] = useState<PlayerI[]>([]);
//   const [finishGameCheckResult, setFinishGameCheckResult] = useState<null | {
//     winner: boolean,
//     isDraw: boolean,
//     cheatWin: boolean
//   }>(null);
//   const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0);

// const [gameState, setGameState] = useState({
//   finishGameCheckResult: {winner: true},
//   finishedGameState: null,
//   gameId: 0,
//   winner: true,
//   loser: false,
//   isDraw: false,
//   disqualified: null,
//   resigned: null,
//   players: null,
//
// });
// console.log('GameStateContextProvider - gameState:', gameState);

//   return <GameStateContext.Provider value={GameStateContextDefault}>{children}</GameStateContext.Provider>;
// };
