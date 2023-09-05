import { StaticImageData } from 'next/image';
import React, { ReactNode } from 'react';
import { PlayerI } from 'types/game';
import { PlayerPropsI } from '../../Player/PlayerProps';
import { PlayerInfo } from '../../../contexts/GameStateContext'

export interface IScoreCardProps extends PlayerPropsI {
  playerResult: PlayerInfo
  showWinText?: boolean;
  finishResult: { winner: boolean; isDraw: boolean; cheatWin: boolean } | null;
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
