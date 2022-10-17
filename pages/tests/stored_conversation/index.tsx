import {NextPage} from 'next';
import React from "react";
import {Conversation} from '../../../components/Conversation/Conversation';

const ConversationPage: NextPage = () => {
    return <div>
        SIGNER IS HERE
        <Conversation
            recipientWalletAddr={'0x4782353f75c32a6baFb5DA3678A1129a1d2d2Ee8'}
            gameId={115}
        />
    </div>
}

export default ConversationPage;
