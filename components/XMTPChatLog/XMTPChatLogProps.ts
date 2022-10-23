import React from "react";
import {IAnyMessage, IGameMessage} from "../../hooks/useConversation";

export interface XMTPChatLogPropsI {
    children?: React.ReactNode;
    anyMessages: IAnyMessage[];
    isLoading?: boolean;
}
