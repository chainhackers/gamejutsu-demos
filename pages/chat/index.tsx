import { useState, useCallback, useEffect } from "react";
import { useWalletContext } from "../../context/WalltetContext";
import { useXmptContext } from "../../context/XmtpContext";
import { Conversation, Message, Stream } from '@xmtp/xmtp-js'
import { threadId } from "worker_threads";

const RecipientInputMode = {
  InvalidEntry: 0,
  ValidEntry: 1,
  FindingEntry: 2,
  Submitted: 3,
  NotOnNetwork: 4,
}


const ChatPage = () => {
    const [addressInputValue, setAddressInputValue] = useState<string>('0xDb0b11d1281da49e950f89bD0F6B47D464d25F91');
    const [isClientOnNetWork, setIsClientOnNetWork] = useState<boolean>(false);
    const [recipientInputMode, setRecipientInputMode] = useState(
    RecipientInputMode.InvalidEntry
    )
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [sentMessage, setSentMessages] = useState<any[]>([])
    const [incommingMessages, setIncomingMessages] = useState<any[]>([]);
    const { address, signer } = useWalletContext();
    const { client } = useXmptContext();
    console.log('address', address);
    console.log('signer', signer);
    console.log('clientXXX', client);

    const checkIfOnNetwork = useCallback(
        async (address: string): Promise<boolean> => {
            console.log('client', client)
      return client?.canMessage(address) || false
    },
    [client]
  )

    const submitHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        console.log('addressInputValue', addressInputValue)
        const isInNetwork = !!addressInputValue ? await checkIfOnNetwork(addressInputValue) : false;
        console.log('isInNetWork', isInNetwork);
        setIsClientOnNetWork(isInNetwork);
        if (!!isInNetwork && !!addressInputValue) {
            setRecipientInputMode(RecipientInputMode.Submitted)
            const newConversation = await client?.conversations.newConversation(addressInputValue)!
            console.log('newConversation', newConversation)
            if (!newConversation) console.error('no new conversation');
            setConversation(newConversation)

        }
        

    }

    const sendMessageHandler = () => {
        const messageText = String(`Time stamp: ${Date.now()}`)
        if (!conversation) {
            alert('no conversation!');
            return;
        }
        conversation.send(messageText).then((data) => {
            console.log('send message data', data.id, data.content);
            const newSentMessage = {id: data.id, content: data.content};
            setSentMessages([...sentMessage, newSentMessage])
        }).catch(error => {
            console.error('send message error', error);

        })
    }

    useEffect(() => {
        if (!conversation) {
            console.log('no conversation');
            return;
        }
        conversation.messages().then((messages) => {
            console.log('messages', messages);
            setSentMessages(messages);
        });

    }, [])

    useEffect(() => {
        if (!conversation) {
            console.log('no conversation');
            return;
        }

        const testMess = async () => {
            const stream = await conversation.streamMessages()
            console.log('stream', stream);
            for await (const msg of stream) {
                console.log('msg', msg)
                console.log('incomming message');
                const incommingMess = { id: msg.id, content: msg.content}
                setIncomingMessages([...incommingMessages, incommingMess])
        // if (dispatchMessages) {
        //   dispatchMessages({
        //     peerAddress: conversation.peerAddress,
        //     messages: [msg],
        //   })
        // }
        // if (onMessageCallback) {
        //   onMessageCallback()
        // }
      }
        }
        // conversation.streamMessages().then((stream) => {
        //     console.log('stream', stream);
            
            

        // })
        testMess();

    });


    return <div>Chat
        <div>
            0xDb0b11d1281da49e950f89bD0F6B47D464d25F91
            <form onSubmit={submitHandler}>
            <label>Address to chat</label>
            <input value={addressInputValue} onChange={(event) => setAddressInputValue(event.target.value)}></input>
            <button type="submit">Submit</button>
            </form>
        </div>
        <div>Conversation
            {conversation ? <div>Has converstaion<div>
                <button onClick={sendMessageHandler}>Send Message</button>
                <div style={{ display: 'flex'}}>
                    <div style={{ padding: '5px'}}>Outgoing messages: {sentMessage.map(({ id, content }) => <div><span>{`id: ${id}`}</span><span> {content}</span></div>)}</div>
                <div style={{ padding: '5px'}}>Incoming messages: {incommingMessages.map(({ id, content }) => <div><span>{`id: ${id}`}</span> <span>{content}</span></div>)}</div>

                </div>
                
            </div>
            </div> : <div>No conversation</div>}
        </div>
    </div>;
}

export default ChatPage;