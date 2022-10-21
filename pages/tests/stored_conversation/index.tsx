import {NextPage} from 'next';
import React from "react";
import {Conversation} from '../../../components/Conversation/Conversation';

const ConversationPage: NextPage = () => {
    return <div>
        SIGNER IS HERE
        <Conversation
            recipientWalletAddr={'0x5Ce2D6FDb0548234c376348aaB6463378b7B7af3'}
            gameId={125}
        />
    </div>
}

export default ConversationPage;
