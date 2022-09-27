import {IChatLog} from 'types';
import React from "react";

export interface XMTPChatLogPropsI {
    gameType: string;
    children?: React.ReactNode;
    logData: IChatLog[];
    isLoading?: boolean;
}
