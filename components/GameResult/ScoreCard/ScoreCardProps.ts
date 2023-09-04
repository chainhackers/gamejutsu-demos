import { StaticImageData } from 'next/image';
import React, { ReactNode } from 'react';
import { PlayerI } from 'types/game';
import { PlayerPropsI } from '../../Player/PlayerProps'
export interface IScoreCardProps extends PlayerPropsI{
  playerResult: {
    address?: string | null;
    playerType?: React.ReactNode;
    moves?: boolean;
  } | null;
  showWinText?: boolean,
  finishResult: { winner: boolean; isDraw: boolean; cheatWin: boolean } | null
}

// playerName: string,
// playerImg: string | StaticImageData,
// showWinText: boolean,
// icon: ReactNode,
// playerIndex: number,
// players?: PlayerI[],
// finishGameCheckResult: {
//   winner: boolean;
//   isDraw: boolean;
//   cheatWin: boolean;
// } | null,