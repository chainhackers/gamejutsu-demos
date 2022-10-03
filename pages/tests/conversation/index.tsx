import {NextPage} from 'next';
import AddressPill from "../../../components/Conversation/AddressPill";
import React, {useEffect, useRef, useState} from "react";
import MessagesList from "../../../components/Conversation/Messagelist";
import {Client, Message} from '@xmtp/xmtp-js'

import {useAccount, useSigner} from "wagmi";

const ConversationPage: NextPage = () => {

    const [messages, setMessages] = useState<Message[]>([]);

    const {address, isConnected} = useAccount();
    const {data: signer} = useSigner();
    const messagesEndRef = useRef(null);
    const [addr, setAddr] = useState<string>("");

    useEffect(() => {
        if (isConnected && signer) {
            console.log('isConnected', isConnected);
            console.log('signer', signer);
            const msgs = [...messages];
            Client.create(signer).then(xmtp =>

                xmtp.conversations.newConversation(
                    '0x3Be65C389F095aaa50D0b0F3801f64Aa0258940b'
                )
            ).then(conversation => {
                conversation.send('Hello world 112')
                    .then(message => {
                        msgs.push(message);
                        setMessages([...msgs]);
                    })
                    .then(() => conversation.send('Hello world 2'))
                    .then(message => {
                        msgs.push(message);
                        setMessages([...msgs]);
                    })
                    .then(() => conversation.send('Hello world 3'))
                    .then(message => {
                        msgs.push(message);
                        setMessages([...msgs]);
                    })
            });

            signer.getAddress().then(setAddr);
        }

    }, [isConnected, signer]);


    if (signer) {
        return <div>
            <span>signer</span>
            <AddressPill address={addr}/>
            <MessagesList messagesEndRef={messagesEndRef} messages={messages}/>
        </div>;

    } else {
        return <div>no signer</div>
    }
}


export default ConversationPage;