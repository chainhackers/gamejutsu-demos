// // finishGameCheckResult
// // finishedGameState
// // FinishedGameState - класс где есть
// import {FinishedGameState} from "../gameApi";
// import React, {useCallback, useEffect, useState} from "react";
// import {Client, Conversation, Message} from "@xmtp/xmtp-js";
// import {useAccount, useSigner} from "wagmi";
// import {MessageStore, XmtpContext, XmtpContextType} from "./xmtp";
// import {Signer} from "ethers";
//
// // console.log('FINISH GameResult FinishedGameState', FinishedGameState)
// // console.log('FINISH GameResult finishGameCheckResult', finishGameCheckResult);

export const GameStateContextDefault: GameStateType = {
  finishGameCheckResult: null,
  finishedGameState: null,
  gameId: 0,
  winner: null,
  loser: null,
  isDraw: false,
  disqualified: null,
  resigned: null,
};

export type GameStateType = {
  finishGameCheckResult: null;
  finishedGameState: null;
  gameId: number;
  winner: string | null;
  loser: string | null;
  isDraw: boolean;
  disqualified: string | null;
  resigned: string | null;
};


// export const GameStateContext: React.FC<{ children: React.ReactNode }> = ({children,}) => {
//
//   const [providerState, setProviderState] = useState<XmtpContextType>({
//     client,
//     loadingConversations,
//     initClient,
//   });
//   return (
//     <XmtpContext.Provider value={providerState}>
//       {children}
//     </XmtpContext.Provider>
//   )
// }
//
// export default GameStateContext