import {useEffect, useState} from 'react';
import {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import {ParsedUrlQuery} from 'querystring';
import {Conversation, Stream, Message} from '@xmtp/xmtp-js';
import {useXmptContext} from 'context/XmtpContext';


import {XMTPChatLog} from 'components/XMTPChatLog';
import {useWalletContext} from 'context/WalltetContext';
import {ControlPanel} from 'components/ControlPanel';
import arbiterContract from 'contracts/Arbiter.json';
import rulesContract from 'contracts/TicTacToeRules.json';

import styles from 'pages/games/gameType.module.scss';
import {ETTicTacToe} from "components/Games/ET-Tic-Tac-Toe";
import {TicTacToeState, TTTMove} from "components/Games/ET-Tic-Tac-Toe/types";
import {IChatLog} from "../../types";
import {_isValidSignedMove, checkIsValidMove, getArbiter, getSigner, getRulesContract, finishGame, disputeMove, initTimeout, resolveTimeout, finalizeTimeout} from "../../gameApi";
import {ISignedGameMove, SignedGameMove} from "../../types/arbiter";
import { signMove, signMoveWithAddress } from 'helpers/session_signatures';
import { ContractMethodNoResultError } from 'wagmi';

interface IGamePageProps {
    gameType?: string;
}

interface IParams extends ParsedUrlQuery {
    gameType: string;
}

const Game: NextPage<IGamePageProps> = ({gameType}) => {
    const [log, setLog] = useState<IChatLog[]>([]);
    const [isLogLoading, setIsLogLoading] = useState<boolean>(true);


    const initialState = new TicTacToeState(1, 'X')
        .makeMove(TTTMove.fromMove(0, 'X'))
        .makeMove(TTTMove.fromMove(1, 'X'))
        .makeMove(TTTMove.fromMove(2, 'X'))
        .makeMove(TTTMove.fromMove(3, 'X'))
        .makeMove(TTTMove.fromMove(4, 'O'))
        .makeMove(TTTMove.fromMove(5, 'X'))
        .makeMove(TTTMove.fromMove(6, 'X'))
        .makeMove(TTTMove.fromMove(7, 'X'))
        .makeMove(TTTMove.fromMove(8, 'X'))
    const [gameState, setGameState] = useState<TicTacToeState>(initialState);

    const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0); //TODO use in game state creation
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [isInDispute, setIsInDispute] = useState<boolean>(false);
    const [conversationStatus, setConversationStatus] = useState<string | null>('not connected');
    const [rivalPlayerAddress, setRivalPlayerAddress] = useState<string | null>("0x3Be65C389F095aaa50D0b0F3801f64Aa0258940b"); //TODO
    const [newMessage, setNewMessage] = useState<{ content: object; sender: string } | null>(
        null,
    );
    const [lastMove, setLastMove] = useState<ISignedGameMove| null>(null);
    const [lastWinnerMove, setLastWinnerMove] = useState<ISignedGameMove| null>(null);
    const [lastOpponentMove, setLastOpponentMove] = useState<ISignedGameMove| null>(null);
    const [winner, setWinner] = useState<0 | 1 | null>(null);
    const [gameId, setGameId] = useState<string | null>(null);
    const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);

    const {client, initClient} = useXmptContext();
    const {signer} = useWalletContext();

    const setConversationHandler = async (rivalPlayerAddress: string) => {
        console.log('setConversationHandler');
        setRivalPlayerAddress(rivalPlayerAddress);
        if (!signer) return;
        console.log('before init client');
        initClient(signer);
        setGameState(new TicTacToeState(Number(gameId!), playerIngameId === 0 ? 'X' : 'O'));
    };


    const sendSignedMoveHandler = async (msg: ISignedGameMove) => {
        const messageText = JSON.stringify(msg);
        console.log({messageText});

        if (!conversation) {
            console.warn('no conversation!');
            return;
        }

        let address = await getSigner().getAddress();
        const lastWinnerMove = await gameState.signWinnerEncodedMove(msg.gameMove.move, address, nextGameState.playerType);

        _isValidSignedMove(getArbiter(), msg).then((isValid) => {

            const nextGameState = gameState.encodedMove(msg.gameMove.move, isValid);
            
            conversation.send(messageText).then(() => {
                console.log('message sent, setting new state:', nextGameState);
                setLastMove(msg);
                setGameState(nextGameState);
                setLastWinnerMove(lastWinnerMove);
                console.log('new state is set after sending the move', gameState);
            });

        })

    }


    const runFinishGameHandler = async () => {
        if (!lastOpponentMove) {
            console.log("no lastOpponentMove")
            return;
        }
        if (!lastWinnerMove) {
            console.log("no lastMove")
            return;
        }
        let address = await getSigner().getAddress();
        const signature = await signMoveWithAddress(lastOpponentMove.gameMove, address);
        const signatures = [...lastOpponentMove.signatures, signature]
        let lastOpponentMoveSignedByAll = new SignedGameMove(lastOpponentMove.gameMove, signatures);
        
        console.log('lastOpponentMoveSignedByAll', lastOpponentMoveSignedByAll);
        console.log('lastWinnerMove', lastWinnerMove);
        
        const finishGameResult = await finishGame(
            getArbiter(),
            [lastOpponentMoveSignedByAll, lastWinnerMove]
        );
        console.log('finishGameResult', finishGameResult);
    };

    const runInitTimeoutHandler = async () => {
        if (!lastOpponentMove) {
            console.log("no lastOpponentMove")
            return;
        }
        if (!lastMove) {
            console.log("no lastMove")
            return;
        }
        let address = await getSigner().getAddress();
        const signature = await signMoveWithAddress(lastOpponentMove.gameMove, address);
        const signatures = [...lastOpponentMove.signatures, signature]
        let lastOpponentMoveSignedByAll = new SignedGameMove(lastOpponentMove.gameMove, signatures);
        console.log('lastOpponentMoveSignedByAll', lastOpponentMoveSignedByAll);
        const initTimeoutResult = await initTimeout(
            getArbiter(),
            [lastOpponentMoveSignedByAll, lastMove]
        );
        console.log('initTimeoutResult', initTimeoutResult);
    };

    const runResolveTimeoutHandler = async () => {
        if (!lastMove) {
            console.log("no lastMove")
            return;
        }
        const resolveTimeoutResult = await resolveTimeout(
            getArbiter(),
            lastMove
        );
        console.log('resolveTimeoutResult', resolveTimeoutResult);
    };

    const runFinalizeTimeoutHandler = async () => {
        if (!gameId) {
            console.log("no gameId")
            return;
        }
        const finalizeTimeoutResult = await finalizeTimeout(
            getArbiter(),
            parseInt(gameId)
        );
        console.log('finalizeTimeoutResult', finalizeTimeoutResult);
    };

    const runDisputeHandler = async () => {
        setIsInDispute(true);
        // TODO: Add disputing messages
        console.log('run dispute');
        console.log('newMessage', newMessage); // Last Message with invalid move

        if (newMessage) {
          const signedMove = newMessage.content as ISignedGameMove;
          console.log('moveToDispute', signedMove);
          const disputeMoveResult = await disputeMove(
            getArbiter(),
            signedMove
          );
          console.log('Dispute move result', disputeMoveResult);
        }
        setIsInDispute(false);
    };

    useEffect(() => {
        if (!!client && !!rivalPlayerAddress) {
            setConversationStatus('Connecting...');

            client?.conversations
                .newConversation(rivalPlayerAddress)
                .then((newConversation) => {
                    setConversation(newConversation);
                    setConversationStatus('Connected');
                    console.log('connected conv', newConversation);
                })
                .catch((error) => {
                    console.log('Conversation error', error);
                    setConversationStatus('Failed');
                });
        }
    }, [client]);

    useEffect(() => {
        let stream: Stream<Message>;
        if (!conversation) {
            // console.log('no conversation');
            return;
        }
        const streamMessages = async () => {
            stream = await conversation.streamMessages();
            for await (const msg of stream) {
                const messageContent = JSON.parse(msg.content);

                if (msg.senderAddress === rivalPlayerAddress) {
                    setNewMessage({content: messageContent, sender: msg.senderAddress!});
                    const signedMove = JSON.parse(msg.content) as ISignedGameMove
                    console.log('signedMove from stream', signedMove);
                    console.log('gameState before move', gameState);

                    _isValidSignedMove(getArbiter(), signedMove).then(isValid => {
                        const nextGameState = gameState.opponentMove(signedMove.gameMove.move, isValid);
                        setLastOpponentMove(signedMove);
                        console.log('nextGameState', nextGameState);
                        setGameState(nextGameState);
                        setIsInvalidMove(!isValid);
                    });

                    
                }

            }
        };

        streamMessages();
        return () => {
            if (!!stream) stream.return();
        };
    }, [conversation, gameState]);


    useEffect(() => {
        const fetchMessages = async () => {
            if (!conversation) {
                // console.warn('no conversation');
                return [];
            }
            const msgs = await conversation.messages();
            const sortedMessages = msgs
                .sort((msg1, msg2) => msg2.sent!.getTime() - msg1.sent!.getTime())
                .map(({id, senderAddress, recipientAddress, sent, content}) => ({
                    id,
                    sender: senderAddress!,
                    recepient: recipientAddress!,
                    timestamp: sent!.getTime(),
                    content,
                }));
            return sortedMessages;
        };
        setIsLogLoading(true);

        fetchMessages()
            .then((data) => {
                setLog(data!);
            })
            .finally(() => {
                setIsLogLoading(false);
            });
    }, [conversation, gameState]);


    if (!!gameType && gameType === 'tic-tac-toe') {
        return (
            <div className={styles.container}>
                <ControlPanel
                    arbiterContractData={{
                        abi: arbiterContract.abi,
                        address: arbiterContract.address,
                    }}
                    gameRulesContractData={{
                        abi: rulesContract.abi,
                        address: rulesContract.address,
                    }}
                    playersTypes={{0: 'X', 1: 'O'}}
                    onConnectPlayer={setConversationHandler}
                    onSetPlayerIngameId={setPlayerIngameId}
                    winner={winner}
                    rivalPlayerConversationStatus={conversationStatus}
                    onProposeGame={setGameId}
                    onAcceptGame={setGameId}
                    isInvalidMove={isInvalidMove}
                    isInDispute={isInDispute}
                    onFinishGame={runFinishGameHandler}
                    onDispute={runDisputeHandler}
                    onInitTimeout={runInitTimeoutHandler}
                    onResolveTimeout={runResolveTimeoutHandler}
                    onFinalizeTimeout={runFinalizeTimeoutHandler}
                />
                <ETTicTacToe
                    gameState={gameState}
                    getSignerAddress={() => {
                        return getSigner().getAddress()
                    }}
                    sendSignedMove={sendSignedMoveHandler}
                />
                <XMTPChatLog logData={log} isLoading={isLogLoading}/>
            </div>
        );
    }
    return <div>No Games Available</div>;
};

export const getStaticProps: GetStaticProps<IGamePageProps, IParams> = (context) => {
    console.log('context', context.params?.gameType);
    return {
        props: {
            gameType: context.params?.gameType,
        },
    };
};

export const getStaticPaths: GetStaticPaths<IParams> = () => {
    const gamesType = ['tic-tac-toe', 'other'];
    const paths = gamesType.map((gameType) => ({params: {gameType}}));
    return {
        paths,
        fallback: false,
    };
};

export default Game;
