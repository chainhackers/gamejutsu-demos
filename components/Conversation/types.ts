import {ISignedGameMove} from "../../types/arbiter";
import React, {useContext, useEffect} from "react";
import XmtpContext, {XmtpContextType} from "../../context/xmtp";
import {Client, Conversation, Message} from "@xmtp/xmtp-js";

export interface IGameConversation {
    gameId(): number;

    peerAddress(): string;

    moves: ISignedGameMove[]; //filtered by game, sorted by nonce
    messages: Message[];

    getMove(nonce: number): ISignedGameMove | null;

    getMoves(fromNonce: number, toNonce: number): ISignedGameMove[];

    onNewMove: (move: ISignedGameMove) => void;

    connected: boolean;
}

export interface IGameConversationProps {
    gameId: number
    peerAddress: string
}

export class GameConversation extends React.Component<IGameConversationProps>
    implements IGameConversation {

    static contextType = XmtpContext

    connected = false;
    moves: ISignedGameMove[] = [];
    messages: Message[] = [];
    conversation: Conversation | null = null;

    constructor(props: IGameConversationProps) {
        super(props);
        const {client, conversations} = this.context as XmtpContextType;

        useEffect(() => {
            this.setConv()
        }, [client, conversations]);

    }

    async setConv() {
        const {client, conversations} = this.context as XmtpContextType;
        if (client && conversations) {
            const existingConv = conversations.get(this.props.peerAddress);

            if (existingConv) {
                this.conversation = existingConv;
            } else {
                this.conversation = await client.conversations.newConversation(
                    this.props.peerAddress
                );
            }
            this.connected = true;
            this.messages = await this.conversation.messages(); //TODO filter by game
        }
    }

    gameId(): number {
        return this.props.gameId;
    }

    peerAddress(): string {
        return this.props.peerAddress;
    }

    onNewMove(move: ISignedGameMove): void {
    }

    getMove(nonce: number): ISignedGameMove | null {
        return null;
    }

    getMoves(fromNonce: number, toNonce: number): ISignedGameMove[] {
        return [];
    }

}

