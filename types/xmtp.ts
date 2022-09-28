export interface IChatLog {
  id: string;
  sender: string;
  recepient: string;
  content: string;
  timestamp: number;
  signatures?: string[];
  move?: string;
  oldState?: string;
  newState?: string;
}
