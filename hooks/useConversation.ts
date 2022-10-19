import { Conversation, Message, SortDirection, Stream } from '@xmtp/xmtp-js'
import { ListMessagesPaginatedOptions } from '@xmtp/xmtp-js/dist/types/src/Client'
import { NewGameBoard } from 'components'
import { useState, useEffect, useContext } from 'react'
import { ISignedGameMove } from 'types/arbiter'
import XmtpContext, { MessageStore } from '../contexts/xmtp'

export const MESSAGES_PER_PAGE = 100;

let stream: Stream<Message>

export interface ISignedGameMoveInMessage extends ISignedGameMove {
    gameType: string;
}

export function asSignedGameMoveInMessage(parsedObject: any): ISignedGameMoveInMessage | null {
    let gameMove = parsedObject?.gameMove;
    let oldState = gameMove?.oldState;
    let newState = gameMove?.newState;
    let gameType = parsedObject?.gameType
    if (!oldState || !newState || !gameType) {
        return null;
    }
    return parsedObject;
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
    otherMessages: Message[]
} {
    let signedGameMoves = [];
    let otherMessages = [];
    let firstMoveHere = false;
    for (const message of messages) {
        let parsedObject = parseMessageContent(message);
        let signedMove = asSignedGameMoveInMessage(parsedObject);
        let thisGame = signedMove?.gameMove.gameId === gameId;
        if (signedMove && thisGame) {
            signedGameMoves.push(signedMove)
        } else if (signedMove && !thisGame) {
            //drop other moves
        } else {
            otherMessages.push(message);
        }
        if ((signedMove?.gameMove.gameId === gameId) && (signedMove?.gameMove.nonce === 0)) {
            firstMoveHere = true;
        }
    }
    return {
        firstMoveHere,
        signedGameMoves,
        otherMessages
    };
}

const useConversation = (
    peerAddress: string,
    gameId: number,
    newGame: boolean,
    stopOnFirstMove: boolean,                                      
) => {
    const { client, setConvoMessages } = useContext(XmtpContext)
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [loading] = useState<boolean>(false)
    const [collectedOtherMessages, setCollectedOtherMessages] = useState<Message[]>([])
    const [collectedSignedGameMoves, setCollectedSignedGameMoves] = useState<ISignedGameMove[]>([])
    const [lastChunckSignedGameMoves, setLastChunckSignedGameMoves] = useState<ISignedGameMove[]>([])

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
            otherMessages: Message[]
        }> => {
        const paginationOptions: ListMessagesPaginatedOptions = {
            pageSize: MESSAGES_PER_PAGE,
            direction: SortDirection.SORT_DIRECTION_DESCENDING,
        }
        let paginator = conversation.messagesPaginated(paginationOptions);
        let _signedGameMoves: ISignedGameMove[] = [];
        let _otherMessages: Message[] = [];
        while (true) {
            const page = await paginator.next()
            if (page.done) {
                console.warn('done loading messages');
                break;
            }
            {
                const { signedGameMoves, otherMessages, firstMoveHere } = filterMessages(newGame, gameId, page.value);
                _signedGameMoves.push(...signedGameMoves);
                _otherMessages.push(...otherMessages);
                if (firstMoveHere && stopOnFirstMove) {
                    break;
                }
            }
        }
        return {
            signedGameMoves: _signedGameMoves,
            otherMessages: _otherMessages
        };
    }

    useEffect(() => {
        if (!conversation) {
            return
        }
        function setMessageStates(signedGameMoves: ISignedGameMove[], otherMessages: Message[]) {
            if (signedGameMoves.length) {
                setCollectedSignedGameMoves((prevValue) => [...signedGameMoves, ...prevValue])
                setLastChunckSignedGameMoves(signedGameMoves);
            }
            if (otherMessages.length) {
                setCollectedOtherMessages((prevValue) => [...otherMessages, ...prevValue])
            }
        }

        const streamMessages = async () => {
            stream = await conversation.streamMessages()
            for await (const message of stream) {
                const { signedGameMoves, otherMessages } = filterMessages(newGame, gameId, [message]);
                setMessageStates(signedGameMoves, otherMessages);
            }
        }
        listMessages(conversation).then(({ otherMessages, signedGameMoves }) => {
            setMessageStates(signedGameMoves, otherMessages);
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

    const handleSend = async (message: string) => {
        if (!conversation) return
        await conversation.send(message)
    }

    return {
        loading,
        sendMessage: handleSend,
        collectedOtherMessages,
        collectedSignedGameMoves,
        lastChunckSignedGameMoves
    }
}

export default useConversation


