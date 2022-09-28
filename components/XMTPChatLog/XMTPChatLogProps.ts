import {IChatLog} from 'types';
import React from "react";

export interface XMTPChatLogPropsI {
    children?: React.ReactNode;
    logData: IChatLog[];
    isLoading?: boolean;
}
