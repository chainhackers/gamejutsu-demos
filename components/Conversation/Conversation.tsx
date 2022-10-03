import React, {useCallback, useEffect, useRef} from 'react'
import useConversation from '../../hooks/useConversation'
import MessagesList from "./Messagelist";

type ConversationProps = {
    recipientWalletAddr: string
}

export const Conversation = ({
                                 recipientWalletAddr,
                             }: ConversationProps): JSX.Element => {
    const messagesEndRef = useRef(null)

    const scrollToMessagesEndRef = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(messagesEndRef.current as any)?.scrollIntoView({behavior: 'smooth'})
    }, [])

    const {messages, sendMessage, loading} = useConversation(
        recipientWalletAddr,
        scrollToMessagesEndRef
    )

    const hasMessages = messages.length > 0

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

    if (loading && !messages?.length) {
        return (
            <span>pls wait</span>
        )
    }

    return (
        <main className="flex flex-col flex-1 bg-white h-screen">
            <div>HERE GOES MESSAGE LIST</div>
            <MessagesList messagesEndRef={messagesEndRef} messages={messages}/>
            <div>AFTER MESSAGE LIST</div>
        </main>
    )
}

export default React.memo(Conversation)