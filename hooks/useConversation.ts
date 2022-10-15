import { Conversation, Message, SortDirection, Stream } from '@xmtp/xmtp-js'
import { ListMessagesPaginatedOptions } from '@xmtp/xmtp-js/dist/types/src/Client'
import { SelectPrize } from 'components'
import { useState, useEffect, useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { WalletContext } from '../contexts/WalltetContext'
import XmtpContext from '../contexts/xmtp'

type OnMessageCallback = (mesage: Message) => void

let stream: Stream<Message>
let latestMsgId: string

// 1) дропнуть инициализацию из провайдера
// 2) добавить в юзконверсэшон раскладывалку по стору в виде композитного ключа или просто функции 
// 3) добавить инициализацию в юзконверсшон 
// 4) добавить фильтрацию в инициализацию и слушалку
// 5) возможно, накапливать сообщения из событий onMessageCallback в useConversation

const useConversation = (
    peerAddress: string,
    secondKeyAkaGameId: string,
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

    const [paginator, setPaginator] = useState<AsyncGenerator<Message[]> | null>(null);


    function showNotification(message: Message) {
        console.log(message);
        // if (latestMsgId !== msg.id &&
        //     Notification.permission === 'granted' &&
        //     msg.senderAddress !== walletAddress &&
        //     !browserVisible) {
        //     new Notification('XMTP', {
        //         body: `${msg.senderAddress}\n${msg.content}`,
        //     })

        //     latestMsgId = msg.id
        // }
    }

    function getMessages(secondKey: string): Message[] {
        return convoMessages.get(conversation!.peerAddress)?.get(secondKey) || [];
    }

    function setMessages(secondKey: string, messages: Message[]): void {
        convoMessages.get(conversation!.peerAddress)?.set(secondKey, messages);
    }

    const nextPage = async (paginator: AsyncGenerator<Message[]>): Promise<Message[]> => {
        if (paginator && conversation) {
            paginator.next().then((result) => {
                if (result.done) {
                    console.warn('done loading messages');
                    console.assert(result.value === undefined);
                    setPaginator(null)
                } else {
                    const oldMessages = getMessages(secondKeyAkaGameId);
                    let almostUniqueMessages = [...oldMessages, ...result.value];
                    setMessages(secondKeyAkaGameId, almostUniqueMessages);
                    setConvoMessages(new Map(convoMessages))

                    for (const message of result.value) {
                        if (onMessageCallback) {
                            onMessageCallback(message)
                        }
                        showNotification(message);
                    }
                    return result.value;

                }


            });
        }
        return Promise.reject();
    }

    useEffect(() => {
        if (!conversation) return
        const listMessages = async () => {
            let _paginator = paginator;
            if (!_paginator) {
                const paginationOptions: ListMessagesPaginatedOptions = {
                    pageSize: 4,
                    direction: SortDirection.SORT_DIRECTION_DESCENDING,
                }
                _paginator = conversation.messagesPaginated(paginationOptions);
                setPaginator(_paginator);

            }
            while (true) {
                try {
                    let messages = await nextPage(_paginator);
                    if (isPagingComplete(messages)) {
                        return;
                    }
                }
                catch (error) {
                    return;
                }
            };
        }

        const streamMessages = async () => {
            stream = await conversation.streamMessages()
            for await (const message of stream) {
                if (setConvoMessages) {
                    const newMessages = getMessages(secondKeyAkaGameId);
                    newMessages.push(message)
                    const uniqueMessages = [
                        ...Array.from(
                            new Map(newMessages.map((item) => [item['id'], item])).values()
                        ),
                    ]
                    setMessages(secondKeyAkaGameId, uniqueMessages);
                    setConvoMessages(new Map(convoMessages))
                }
                showNotification(message);
                if (onMessageCallback) {
                    onMessageCallback(message)
                }
            }
        }
        listMessages();
        streamMessages();
        return () => {
            const closeStream = async () => {
                if (!stream) return;
                await stream.return();
            }
            closeStream();
        }
    }, [
        browserVisible,
        conversation,
        convoMessages,
        onMessageCallback,
        setConvoMessages,
        walletAddress,
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
