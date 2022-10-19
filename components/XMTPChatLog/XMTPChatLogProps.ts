import {IChatLog} from 'types';
import React from "react";
import {IGameMessage} from "../../hooks/useConversation";

export interface XMTPChatLogPropsI {
    children?: React.ReactNode;
    logData: IGameMessage[];
    isLoading?: boolean;
}
