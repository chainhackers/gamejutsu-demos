import { Conversation, Message, SortDirection, Stream } from '@xmtp/xmtp-js'
import { ListMessagesPaginatedOptions } from '@xmtp/xmtp-js/dist/types/src/Client'
import { useState, useEffect, useContext } from 'react'
import { ISignedGameMove } from 'types/arbiter'
import { WalletContext } from '../contexts/WalltetContext'
import XmtpContext from '../contexts/xmtp'

export const MESSAGES_PER_PAGE = 10;
type OnMessageCallback = (mesage: Message) => void

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

export function filterGameMoves(gameId: number) {
    return (messages: Message[]) => {
        return _filterGameMoves(gameId, messages)
    }
}

//returns {need}
function _filterGameMoves(gameId: number, messages: Message[]): boolean {
    let signedMoves = [];
    for (const message of messages) {
        let parsedObject = parseMessageContent(message);
        let signedMove = asSignedGameMoveInMessage(parsedObject);
        if (signedMove) {
            signedMoves.push(signedMove)
        }
        if ((signedMove?.gameMove.gameId === gameId) && (signedMove?.gameMove.nonce === 0)) {
            console.log('paging complete');
            return true;
        }
    }
    console.log('need more pages');
    return false;
}

const useConversation = (
    peerAddress: string,
    secondKey: string,
    isPagingComplete: (messages: Message[]) => boolean,
    onMessageCallback?: OnMessageCallback,
) => {
    const { address: walletAddress } = useContext(WalletContext)
    const { client, convoMessages, setConvoMessages } = useContext(XmtpContext)
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [loading] = useState<boolean>(false)
    const [browserVisible, setBrowserVisible] = useState<boolean>(true)

    useEffect(() => {
        window.addEventListener('focus', () => setBrowserVisible(true))
        window.addEventListener('blur', () => setBrowserVisible(false))
    }, [])

    useEffect(() => {
        const getConvo = async () => {
            if (!client || !peerAddress) {
                return
            }
            setConversation(await client.conversations.newConversation(peerAddress))
        }
        getConvo()
    }, [client, peerAddress])

    function updateMessages(secondKey: string, newerMessages: Message[], olderMessages: Message[]): void {
        const oldMessages = convoMessages.get(conversation!.peerAddress)?.get(secondKey) || [];
        oldMessages.unshift(...newerMessages);
        oldMessages.push(...olderMessages);
        const uniqueMessages = [
            ...Array.from(
                new Map(oldMessages.map((item) => [item['id'], item])).values()
            ),
        ]
        convoMessages.get(conversation!.peerAddress)?.set(secondKey, uniqueMessages);
        setConvoMessages(new Map(convoMessages));
    }

    function showNotification(message: Message) {
        console.log(message);
    }

    const listMessages = async (conversation: Conversation): Promise<Message[]> => {
        const paginationOptions: ListMessagesPaginatedOptions = {
            pageSize: MESSAGES_PER_PAGE,
            direction: SortDirection.SORT_DIRECTION_DESCENDING,
        }
        let paginator = conversation.messagesPaginated(paginationOptions);
        let result = [];
        let lastPage: Message[] = [];
        while (isPagingComplete(lastPage)) {
            const page = await paginator.next()
            if (page.done) {
                console.warn('done loading messages');
                break;
            }
            lastPage = page.value;
            result.push(...lastPage);
        }
        return result;
    }

    useEffect(() => {
        if (!conversation) {
            return
        }
        const streamMessages = async () => {
            stream = await conversation.streamMessages()
            for await (const message of stream) {
                updateMessages(secondKey, [message], []);
                showNotification(message);
                if (onMessageCallback) {
                    onMessageCallback(message)
                }
            }
        }
        listMessages(conversation);
        streamMessages();
        return () => {
            const closeStream = async () => {
                if (!stream) return;
                await stream.return();
            }
            closeStream();
        }
    }, [
        // browserVisible,
        conversation,
        // convoMessages,
        // onMessageCallback,
        // setConvoMessages,
        // walletAddress,
    ])

    const handleSend = async (message: string) => {
        if (!conversation) return
        await conversation.send(message)
    }

    return {
        loading,
        sendMessage: handleSend,
    }
}

export default useConversation


