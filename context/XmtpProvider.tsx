import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Client, Conversation, Message} from '@xmtp/xmtp-js'
import {Signer} from 'ethers'
import {XmtpContext, XmtpContextType} from './xmtp'
import {useAccount, useSigner} from "wagmi";

export const XmtpProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [client, setClient] = useState<Client | null>()
    const {data: signer} = useSigner();
    const {address} = useAccount()

    const [convoMessages, setConvoMessages] = useState<Map<string, Message[]>>(
        new Map()
    )
    const [loadingConversations, setLoadingConversations] =
        useState<boolean>(true)
    const [conversations, setConversations] = useState<Map<string, Conversation>>(
        new Map()
    )

    const initClient = useCallback(
        async (wallet: Signer) => {
            console.log('initClient', wallet, 'oldClient', client)
            if (wallet) {
                if (!client) {
                    try {
                        setClient(await Client.create(wallet, {env: 'production'}))
                    } catch (e) {
                        console.error(e)
                        setClient(null)
                    }
                } else {
                    const newAddress = await wallet.getAddress();
                    if (newAddress !== client.address) {
                        console.log('reset client', wallet);
                        try {
                            // await client.close() //TODO what happens between this and the next line
                            setClient(await Client.create(wallet, {env: 'production'}))
                        } catch (e) {
                            console.error(e)
                            setClient(null)
                        }
                    }
                }
            }
        },
        [client]
    )

    const disconnect = () => {
        setClient(undefined)
        setConversations(new Map())
        setConvoMessages(new Map())
    }

    useEffect(() => {
        signer ? initClient(signer) : disconnect()
    }, [signer])

    useEffect(() => {
        if (!client) return

        const listConversations = async () => {
            console.log('Listing conversations')
            setLoadingConversations(true)
            const convos = await client.conversations.list()
            Promise.all(
                convos.map(async (convo) => {
                    if (convo.peerAddress !== address) {
                        const messages = await convo.messages()
                        convoMessages.set(convo.peerAddress, messages)
                        setConvoMessages(new Map(convoMessages))
                        conversations.set(convo.peerAddress, convo)
                        setConversations(new Map(conversations))
                    }
                })
            ).then(() => {
                setLoadingConversations(false)
                if (Notification.permission === 'default') {
                    Notification.requestPermission()
                }
            })
        }
        const streamConversations = async () => {
            const stream = await client.conversations.stream()
            for await (const convo of stream) {
                if (convo.peerAddress !== address) {
                    const messages = await convo.messages()
                    convoMessages.set(convo.peerAddress, messages)
                    setConvoMessages(new Map(convoMessages))
                    conversations.set(convo.peerAddress, convo)
                    setConversations(new Map(conversations))
                }
            }
        }
        listConversations()
        streamConversations()
    }, [client])

    const [providerState, setProviderState] = useState<XmtpContextType>({
        client,
        initClient,
        loadingConversations,
        conversations,
        convoMessages,
        setConvoMessages,
    })

    useEffect(() => {
        setProviderState({
            client,
            initClient,
            loadingConversations,
            conversations,
            convoMessages,
            setConvoMessages,
        })
    }, [client, initClient, loadingConversations, conversations, convoMessages])

    return (
        <XmtpContext.Provider value={providerState}>
            {children}
        </XmtpContext.Provider>
    )
}

export default XmtpProvider
