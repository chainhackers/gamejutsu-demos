import { IChatLogMessage } from 'types/chat';

export interface IChatLogElementProps {
  anyMessage: IChatLogMessage;
  children?: React.ReactNode;
}
