import { Conversation, Message, Stream } from '@xmtp/xmtp-js'
import { useState, useEffect, useContext } from 'react'
import { WalletContext } from '../contexts/WalltetContext'
import XmtpContext from '../contexts/xmtp'

type OnMessageCallback = () => void

let stream: Stream<Message>
let latestMsgId: string

// 1) дропнуть инициализацию из провайдера
// 2) добавить в юзконверсэшон раскладывалку по стору в виде композитного ключа или просто функции 
// 3) добавить инициализацию в юзконверсшон 
// 4) добавить фильтрацию в инициализацию и слушалку
// 5) возможно, накапливать сообщения из событий onMessageCallback в useConversation

const useConversation = (
  peerAddress: string,
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

  useEffect(() => {
    if (!conversation) return
    const streamMessages = async () => {
      stream = await conversation.streamMessages()
      for await (const msg of stream) {
        if (setConvoMessages) {
          const newMessages = convoMessages.get(conversation.peerAddress) ?? []
          newMessages.push(msg)
          const uniqueMessages = [
            ...Array.from(
              new Map(newMessages.map((item) => [item['id'], item])).values()
            ),
          ]
          convoMessages.set(conversation.peerAddress, uniqueMessages)
          setConvoMessages(new Map(convoMessages))
        }
        if (
          latestMsgId !== msg.id &&
          Notification.permission === 'granted' &&
          msg.senderAddress !== walletAddress &&
          !browserVisible
        ) {
          new Notification('XMTP', {
            body: `${msg.senderAddress}\n${msg.content}`,
          })

          latestMsgId = msg.id
        }
        if (onMessageCallback) {
          onMessageCallback()
        }
      }
    }
    streamMessages()
    return () => {
      const closeStream = async () => {
        if (!stream) return
        await stream.return()
      }
      closeStream()
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
