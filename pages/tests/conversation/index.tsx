import {NextPage} from 'next';
import React, {useEffect, useState} from "react";
import GameHistory from "../../../components/Conversation/GameHistory";
import {GameConversation} from "../../../components/Conversation/types";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {XmtpProvider} from "../../../contexts/XmtpProvider";

const ConversationPage: NextPage = () => {
    const [gameConversation, setGameConversation] = useState<GameConversation | null>(null);

    useEffect(() => {
        setGameConversation(
            new GameConversation(
                {
                    gameId: 1,
                    peerAddress: '0x3Be65C389F095aaa50D0b0F3801f64Aa0258940b',
                },
            )
        );
    }, []);

    return <XmtpProvider>
        <div>
            <ConnectButton/>
            {gameConversation && <GameHistory conv={gameConversation}/>}
        </div>
    </XmtpProvider>
}


export default ConversationPage;
