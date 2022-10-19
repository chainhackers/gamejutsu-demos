import {Conversation, Message, SortDirection, Stream} from '@xmtp/xmtp-js'
import {ListMessagesPaginatedOptions} from '@xmtp/xmtp-js/dist/types/src/Client'
import {useState, useEffect, useContext} from 'react'
import {ISignedGameMove} from 'types/arbiter'
import XmtpContext from '../contexts/xmtp'

import {
    GameFinishedEventObject,
    GameProposedEventObject,
    GameStartedEventObject,
    TimeoutResolvedEventObject,
    TimeoutStartedEventObject
} from "../.generated/contracts/Arbiter";
import {FinishedGameState} from "../gameApi";

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
    messageType: "ISignedGameMove" | "GameProposedEvent" | "GameStartedEvent" | "GameFinishedEvent" | "TimeoutStartedEvent" | "TimeoutResolvedEvent" | "FinishedGameState",
    message: TMessageType
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

function filterMessages(newGame: boolean, gameId: number,
                        messages: Message[]
): {
    firstMoveHere: boolean,
    signedGameMoves: ISignedGameMove[],
    knownGameMessages: IGameMessage[],
    otherMessages: Message[]
} {
    let signedGameMoves: ISignedGameMove[] = [];
    let otherMessages: Message[] = [];
    let knownGameMessages: IGameMessage[] = [];
    let firstMoveHere = false;
    for (const message of messages) {
        let parsedObject = parseMessageContent(message);
        if (!parsedObject) {
            otherMessages.push(message);
            continue;
        }

        if (parsedObject && parsedObject.messageType === "ISignedGameMove") {
            const signedMove = parsedObject.message as ISignedGameMove;

            let thisGame = signedMove.gameMove.gameId === gameId;
            if (thisGame) {
                signedGameMoves.push(signedMove)
            }
            if (thisGame && (signedMove.gameMove.nonce === 0)) {
                firstMoveHere = true;
            }
        } else if (allMessageTypes.includes(parsedObject.messageType)) {
            let thisGame = parsedObject.message.gameId === gameId;
            thisGame && knownGameMessages.push(parsedObject)
        }
    }

    return {
        firstMoveHere,
        signedGameMoves,
        knownGameMessages,
        otherMessages
    };
}

const useConversation = (
    peerAddress: string,
    gameId: number,
    newGame: boolean,
    stopOnFirstMove: boolean,
) => {
    const {client, setConvoMessages} = useContext(XmtpContext)
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [loading] = useState<boolean>(false)
    const [collectedOtherMessages, setCollectedOtherMessages] = useState<Message[]>([])
    const [collectedSignedGameMoves, setCollectedSignedGameMoves] = useState<ISignedGameMove[]>([])
    const [lastChunckSignedGameMoves, setLastChunckSignedGameMoves] = useState<ISignedGameMove[]>([])
    const [lastChunkKnownGameMessages, setLastChunkKnownGameMessages] = useState<IGameMessage[]>([])

    useEffect(() => {
        const getConvo = async () => {
            if (!client || !peerAddress) {
                return
            }
            setConversation(await client.conversations.newConversation(peerAddress))
        }
        getConvo()
    }, [client, peerAddress])

    const listMessages = async (conversation: Conversation):
        Promise<{
            signedGameMoves: ISignedGameMove[],
            otherMessages: Message[],
            knownGameMessages: IGameMessage[]
        }> => {
        const paginationOptions: ListMessagesPaginatedOptions = {
            pageSize: MESSAGES_PER_PAGE,
            direction: SortDirection.SORT_DIRECTION_DESCENDING,
        }
        let paginator = conversation.messagesPaginated(paginationOptions);
        let _signedGameMoves: ISignedGameMove[] = [];
        let _knownGameMessages: IGameMessage[] = [];
        let _otherMessages: Message[] = [];
        while (true) {
            const page = await paginator.next()
            if (page.done) {
                console.warn('done loading messages');
                break;
            }
            {
                const {
                    signedGameMoves,
                    knownGameMessages,
                    otherMessages,
                    firstMoveHere
                } = filterMessages(newGame, gameId, page.value);
                _signedGameMoves.push(...signedGameMoves);
                _knownGameMessages.push(...knownGameMessages);
                _otherMessages.push(...otherMessages);
                if (firstMoveHere && stopOnFirstMove) {
                    break;
                }
            }
        }
        return {
            signedGameMoves: _signedGameMoves,
            otherMessages: _otherMessages,
            knownGameMessages: _knownGameMessages,
        };
    }

    useEffect(() => {
        if (!conversation) {
            return
        }

        function setMessageStates(signedGameMoves: ISignedGameMove[], otherMessages: Message[], knownGameMessages: IGameMessage[]) {
            if (signedGameMoves.length) {
                setCollectedSignedGameMoves((prevValue) => [...signedGameMoves, ...prevValue])
                setLastChunckSignedGameMoves(signedGameMoves);
            }
            if (knownGameMessages.length) {
                setLastChunkKnownGameMessages(knownGameMessages);
            }
            if (otherMessages.length) {
                setCollectedOtherMessages((prevValue) => [...otherMessages, ...prevValue])
            }
        }

        const streamMessages = async () => {
            stream = await conversation.streamMessages()
            for await (const message of stream) {
                const {signedGameMoves, otherMessages, knownGameMessages} = filterMessages(newGame, gameId, [message]);
                setMessageStates(signedGameMoves, otherMessages, knownGameMessages);
            }
        }
        listMessages(conversation).then(({otherMessages, signedGameMoves, knownGameMessages}) => {
            setMessageStates(signedGameMoves, otherMessages, knownGameMessages);
        }).then( // we can lose some useless messages here
            () => streamMessages()
        );
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
        collectedOtherMessages,
        collectedSignedGameMoves,
        lastChunckSignedGameMoves,
        lastChunkKnownGameMessages
    }
}

export default useConversation


