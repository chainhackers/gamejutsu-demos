import React, {useRef} from "react";
import {useAccount} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import AddressPill from "./AddressPill";
import MessagesList from "./Messagelist";
import {IGameConversation} from "./types";

export interface IGameHistoryProps {
    conv: IGameConversation;
}

class GameHistory extends React.Component<IGameHistoryProps> {

    render() {
        const {address} = useAccount();
        const {conv} = this.props;
        const messagesEndRef = useRef(null);

        if (address && conv.connected) {
            return <div>
                <AddressPill address={address}/>
                <MessagesList
                    messagesEndRef={messagesEndRef}
                    messages={conv.messages}
                />
            </div>
        } else {
            return <ConnectButton/>
        }
    }
}

export default GameHistory;