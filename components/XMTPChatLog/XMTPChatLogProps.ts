import { IChatLog } from 'types';
export interface XMTPChatLogPropsI {
    children?: React.ReactNode;
    logData: IChatLog[];
    isLoading?: boolean;
}
