import React from "react";

export interface PlayerPropsI {
  children?: React.ReactNode;
  playerName?: string | null;
  address?: string | null;
  playerType?: React.ReactNode;
  avatarUrl?: string;
  moves?: boolean;
}
