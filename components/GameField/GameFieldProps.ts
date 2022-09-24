export interface GameFieldPropsI {
  children?: React.ReactNode;
  gameId: string | null;
  rivalPlayerAddress: string | null;
  isConnected: boolean;
  isInDispute?: boolean;
  disputeAppealPlayer: string | null;
  winner: string | null;
}
