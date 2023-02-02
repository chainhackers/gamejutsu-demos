import { IAnyMessage } from "hooks/useConversation";

export interface IGetHistoryProps { 
  children?: React.ReactNode,
  history: IAnyMessage[],
  gameId: number,
  messageHistory: {[id: string]: any}[],
  
 };
