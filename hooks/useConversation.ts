import { Conversation, Message, SortDirection, Stream } from '@xmtp/xmtp-js'
import { ListMessagesPaginatedOptions } from '@xmtp/xmtp-js/dist/types/src/Client'
import { useState, useEffect, useContext } from 'react'
import { ISignedGameMove } from 'types/arbiter'
import XmtpContext from '../contexts/xmtp'

import {
    GameFinishedEventObject,
    GameProposedEventObject,
    GameStartedEventObject,
    TimeoutResolvedEventObject,
    TimeoutStartedEventObject
} from "../.generated/contracts/esm/types/polygon/Arbiter";
import { FinishedGameState } from "../gameApi";

export const MESSAGES_PER_PAGE = 100;

let stream: Stream<Message>

export type TGameType = 'tic-tac-toe' | 'checkers'
export type TMessageType = ISignedGameMove |
    GameProposedEventObject | GameStartedEventObject | GameFinishedEventObject |
    TimeoutStartedEventObject | TimeoutResolvedEventObject | FinishedGameState

const allMessageTypes = ["ISignedGameMove",
    "GameProposedEvent", "GameStartedEvent", "GameFinishedEvent",
    "TimeoutStartedEvent", "TimeoutResolvedEvent",
    "FinishedGameState"]

export interface IGameMessage {
    gameType: TGameType,
    gameId: number;
    messageType: "ISignedGameMove" | "GameProposedEvent" | "GameStartedEvent" | "GameFinishedEvent" | "TimeoutStartedEvent" | "TimeoutResolvedEvent" | "FinishedGameState",
    message: TMessageType,
}

export interface IAnyMessage extends IGameMessage {
    underlyingMessage: Message
}


async function sendMessage(conversation: Conversation | null, message: IGameMessage) {
    if (!conversation) {
        return
    }
    await conversation.send(JSON.stringify(message))
}

export function parseMessageContent(message: any) {
    try {
        return message.content && JSON.parse(message.content);
    } catch (e) {
        return null;
    }
}

function filterMessages(
    gameId: number,
    incomingMessages: Message[]
): {
    firstMoveHere: boolean,
    messages: IAnyMessage[]
} {
    let messages: IAnyMessage[] = []
    let firstMoveHere = false;
    for (const incomingMessage of incomingMessages) {
        let parsedObject = parseMessageContent(incomingMessage);
        if (!parsedObject) {
            continue;
        }
        if (allMessageTypes.includes(parsedObject.messageType)) {
            let thisGame = parsedObject.gameId === gameId;
            if (thisGame) {
                if (parsedObject.messageType === 'GameProposedEvent') {
                    firstMoveHere = true;
                }
                parsedObject.underlyingMessage = incomingMessage;
                messages.push(parsedObject);
            }
        }
    }
    return {
        firstMoveHere,
        messages
    };
}

async function getMessageHistory(conversation: Conversation, gameId: number, stopOnFirstMove: boolean):
    Promise<{
        messages: IAnyMessage[]
    }> {
    const paginationOptions: ListMessagesPaginatedOptions = {
        pageSize: MESSAGES_PER_PAGE,
        direction: SortDirection.SORT_DIRECTION_DESCENDING,
    }
    const paginator = conversation.messagesPaginated(paginationOptions);
    const messages: IAnyMessage[] = [];
    while (true) {
        const page = await paginator.next()
        if (page.done) {
            console.warn('done loading messages');
            break;
        }
        {
            const {
                firstMoveHere,
                messages: _messages
            } = filterMessages(gameId, page.value);
            messages.push(..._messages);
            if (firstMoveHere && stopOnFirstMove) {
                break;
            }
        }
    }
    return {
        messages,
    };
}

const useConversation = (
    peerAddress: string,
    gameId: number,
    newGame: boolean,
    stopOnFirstMove: boolean,
) => {
    const { client } = useContext(XmtpContext);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [loading] = useState<boolean>(false);
    const [collectedMessages, setCollectedMessages] = useState<IAnyMessage[]>([]);
    const [lastMessages, setLastMessages] = useState<IAnyMessage[]>([]);

    useEffect(() => {
        const getConvo = async () => {
            if (!client || !peerAddress) {
                return
            }
            setConversation(await client.conversations.newConversation(peerAddress))
        }
        getConvo()
    }, [client, peerAddress])



    useEffect(() => {
        if (!conversation) {
            return
        }

        function setMessageStates(messages: IAnyMessage[]) {
            if (messages.length) {
                setCollectedMessages((prevValue) => [...messages, ...prevValue])
                setLastMessages(messages);
            }
        }

        const streamMessages = async () => {
            stream = await conversation.streamMessages()
            for await (const message of stream) {
                const { messages } = filterMessages(gameId, [message]);
                setMessageStates(messages);
            }
        }
        if (newGame) {
            getMessageHistory(conversation, gameId, stopOnFirstMove).then(({ messages }) => {
                setMessageStates(messages);
            }).then( // we can lose some useless messages here
                () => streamMessages()
            )
        } else {
            streamMessages();
        }
        return () => {
            const closeStream = async () => {
                if (!stream) return;
                await stream.return();
            }
            closeStream();
        }
    }, [
        conversation,
    ])

    return {
        loading,
        sendMessage: ((msg: IGameMessage) => sendMessage(conversation, msg)),
        collectedMessages,
        lastMessages
    }
}

export default useConversation


