// https://github.com/xmtp/example-chat-react/blob/main/components/Conversation/Conversation.tsx

import {Message} from '@xmtp/xmtp-js';
import React, {useCallback, useEffect, useRef, useState} from 'react'
import useConversation from '../../hooks/useConversation'
import MessagesList from "./Messagelist";

type ConversationProps = {
    recipientWalletAddr: string,
    gameId: number
}

export const Conversation = ({
                                 recipientWalletAddr,
                                 gameId
                             }: ConversationProps): JSX.Element => {
    const messagesEndRef = useRef(null)

    const scrollToMessagesEndRef = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(messagesEndRef.current as any)?.scrollIntoView({behavior: 'smooth'})
    }, [])

    const {sendMessage, loading, otherMessagesState, signedGameMovesState} = useConversation(
        recipientWalletAddr,
        gameId,
        false,
        true
    )

    const hasMessages = otherMessagesState.length > 0

    useEffect(() => {
        if (!hasMessages) return
        const initScroll = () => {
            scrollToMessagesEndRef()
        }
        initScroll()
    }, [recipientWalletAddr, hasMessages, scrollToMessagesEndRef])

    if (!recipientWalletAddr) {
        return <div>NO RECIPIENT</div>
    }

    if (loading && !otherMessagesState?.length) {
        return (
            <span>pls wait</span>
        )
    }

    return (
        <main className="flex flex-col flex-1 bg-white h-screen">
            <div>HERE GOES MESSAGE LIST BUT NO ANY GAMEMOVES HERE</div>
            <MessagesList messagesEndRef={messagesEndRef} messages={otherMessagesState}/>
            <div>AFTER MESSAGE LIST</div>
            <div>{JSON.stringify(signedGameMovesState)}</div>
        </main>
    )
}

export default React.memo(Conversation)
