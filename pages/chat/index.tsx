import { useWalletContext } from "../../context/WalltetContext";
import { useXmptContext } from "../../context/XmtpContext";

const ChatPage = () => {
    const { address, signer } = useWalletContext();
    const { client } = useXmptContext();
    console.log('address', address);
    console.log('signer', signer);
    console.log('client', client);
    return <div>Chat</div>;
}

export default ChatPage;