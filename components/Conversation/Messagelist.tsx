//https://github.com/xmtp/example-chat-react/blob/main/components/Conversation/MessagesList.tsx

import { DecodedMessage as Message } from '@xmtp/xmtp-js'
import Blockies from 'react-blockies'
import React, {MutableRefObject} from 'react'
import {formatTime} from './helpers'
import AddressPill from "./AddressPill";
import { IAnyMessage } from 'hooks/useConversation';

export type MessageListProps = {
    messages: IAnyMessage[]
    messagesEndRef: MutableRefObject<null>
}

type MessageTileProps = {
    message: Message
}

const MessageTile = ({message}: MessageTileProps): JSX.Element => (
    <div className="flex items-start mx-auto mb-4">
        {message.senderAddress &&
            <Blockies seed={message.senderAddress} size={10} className="rounded-full"/>
        }
        <div className="ml-2">
            <div>
                <AddressPill address={message.senderAddress as string}/>
                <span className="text-sm font-normal place-self-end text-n-300 text-md uppercase">
          {formatTime(message.sent)}
        </span>
            </div>
            <span className="block text-md px-2 mt-2 text-black font-normal">
        {message.error ? (
            `Error: ${message.error?.message}`
        ) : (
            <span>{message.content}</span>
        )}
      </span>
        </div>
    </div>
)


const ConversationBeginningNotice = (): JSX.Element => (
    <div className="flex align-items-center justify-center pb-4">
    <span className="text-gray-300 text-sm font-semibold">
      This is the beginning of the conversation
    </span>
    </div>
)

const MessagesList = ({
                          messages,
                          messagesEndRef,
                      }: MessageListProps): JSX.Element => {
    let lastMessageDate: Date | undefined

    return (
        <div className="flex-grow flex">
            <div className="pb-6 md:pb-0 w-full flex flex-col self-end">
                <div className="max-h-[80vh] relative w-full bg-white px-4 pt-6 overflow-y-auto flex">
                    <div className="w-full">
                        {messages && messages.length ? (
                            <ConversationBeginningNotice/>
                        ) : null}
                        {messages?.map((msg) => {
                            lastMessageDate = msg.underlyingMessage.sent
                            return (
                                <MessageTile message={msg.underlyingMessage} key={msg.underlyingMessage.id}/>
                            )
                        })}
                        <div ref={messagesEndRef}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(MessagesList)
