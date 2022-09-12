import React, { useState, ReactElement, useEffect, useCallback } from 'react';
import Board from './Board';

import { Player, Viewer } from 'components';
import { IPlayer } from 'types';
import { Conversation, Message, Stream } from '@xmtp/xmtp-js';

import { useXmptContext } from '../../context/XmtpContext';

import styles from './game.module.scss';
import { useFeeData } from 'wagmi';

//https://codesandbox.io/embed/react-typescript-tic-tac-toe-yw13p
function App() {
    const { client } = useXmptContext();
    const checkIfOnNetwork = useCallback(
        async (address: string): Promise<boolean> => {
            return client?.canMessage(address) || false;
        },
        [client],
    );
    // console.log('client', client);

    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<IPlayer | null>(null);
    const [peerPlayer, setPeerPlayer] = useState<IPlayer | null>(null);
    const [newPlayerInputValue, setNewPlayerInputValue] = useState<string>(
        '0x1215991085d541A586F0e1968355A36E58C9b2b4',
    );
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [gameState, setGameState] = useState<any[]>([[{ squares: [] }], false, false]);
    const [type, setType] = useState<'O' | 'X'>('O');
    // const [finished, setFinished] = useState<boolean>(false);

    const [history, setHistory] = useState([{ squares: new Array(9) }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [finished, setFinished] = useState(false);
    const handleClick = (i: number) => {
        if (finished) {
            return;
        }
        if (stepNumber >= 9) {
            setFinished(true);
            return;
        }
        const _history = history.slice(0, stepNumber + 1);
        const squares = [...gameState[0][gameState[0].length - 1].squares];

        if (squares[i]) {
            return;
        }

        squares[i] = type;
        const winner = calculateWinner(squares);
        // console.log('winner', winner);
        // const summaryState = [[..._history, { squares }], winner === 'X', winner === 'O'];
        const newGameState = [[...gameState[0], { squares }], winner === 'X', winner === 'O'];
        // console.log('newGameState', newGameState);
        // console.log('squares', squares);
        // console.log('summatyState', summaryState);

        if (winner) {
            // console.log('sumarry', summaryState);
            setFinished(true);
            // return;
        }
        // squares[i] = xIsNext ? 'X' : 'O';

        // console.log('history:', [..._history, { squares }], _history.length, stepNumber);

        // console.log('sumarry', summaryState);
        sendMessageHandler(newGameState);
        // setHistory([..._history, { squares }]);
        setStepNumber(_history.length);
        setXIsNext(!xIsNext);
    };

    const jumpTo = (step: number) => {
        setStepNumber(step);
        setXIsNext(step % 2 === 0);
        setFinished(false);
    };

    const _history = [...history];
    // console.log('history', history);
    // console.log('_history111', _history, stepNumber);
    // const squares = _history[stepNumber] ? [..._history[stepNumber].squares] : [];
    // console.log('squares111', squares);
    // const winner = calculateWinner(squares);
    // const status = winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext ? 'X' : 'O');
    const moves = _history.map((step, move) => {
        const desc = move ? 'Go to move #' + move : 'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    const addNewPlayerHandler: React.MouseEventHandler = async () => {
        // console.log('new Player', newPlayerInputValue);
        const isInNetwork = !!newPlayerInputValue
            ? await checkIfOnNetwork(newPlayerInputValue)
            : false;

        if (!!isInNetwork && !!newPlayerInputValue) {
            const newConversation = await client?.conversations.newConversation(
                newPlayerInputValue,
            )!;
            if (!newConversation) {
                console.error('no conversation');
                return;
            }
            setConversation(newConversation);
        }
    };

    const sendMessageHandler = async (state: any) => {
        const messageText = JSON.stringify(state);
        if (!conversation) {
            console.warn('no conversation!');
            return;
        }
        const message = await conversation.send(messageText);
        // console.log('message', message);
    };

    const setTypeHandler = async (type: 'O' | 'X') => {
        setType(type);
        if (!conversation) {
            console.warn('no conversation!');
            return;
        }
        if (!!currentPlayer && !!peerPlayer) {
            // console.log('message type call');
            const typeMessage: {
                message: string;
                peerPlayer: string;
                data: { [id: string]: string };
            } = {
                message: 'type',
                peerPlayer: peerPlayer.id,
                data: { [currentPlayer.id]: type, [peerPlayer.id]: type === 'O' ? 'X' : 'O' },
            };
            const message = await conversation.send(JSON.stringify(typeMessage));
        }
    };

    useEffect(() => {
        if (!!client?.address) {
            setCurrentPlayer({ id: client.address });
        }
    }, [client]);

    useEffect(() => {
        if (!!conversation?.peerAddress) {
            setPeerPlayer({ id: conversation?.peerAddress });
        }
    }, [conversation]);

    const getPeerPleer = () => peerPlayer;
    const getCurrentPleer = () => currentPlayer;

    useEffect(() => {
        if (!conversation) {
            console.log('no conversation');
            return;
        }

        let stream: Stream<Message>;

        const streamMessages = async () => {
            stream = await conversation.streamMessages();

            for await (const msg of stream) {
                // setIncomingMessages([...incommingMessages, msg]);
                // console.log('stream message', msg);
                // console.log('stream mesage content', JSON.parse(msg.content));
                const messageContent = JSON.parse(msg.content);
                // const sender = msg.senderAddress;

                if (!!messageContent && messageContent.message === 'type') {
                    setType(messageContent.data[currentPlayer!.id]);
                } else {
                    setGameState(JSON.parse(msg.content));
                    // console.log('stream', _history);
                    // console.log('stream', [..._history]);
                    const newHistory = [...JSON.parse(msg.content)[0]];
                    // console.log('newHistory', newHistory);
                    setHistory(newHistory);
                }
            }
            return stream;
        };

        streamMessages();
    }, [conversation, peerPlayer, currentPlayer, type]);

    useEffect(() => {
        console.log('gameState', gameState);
        // console.log('squares', squares);
    }, [gameState]);

    useEffect(() => {
        if (currentPlayer?.id === '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91') {
            setNewPlayerInputValue('0x1215991085d541A586F0e1968355A36E58C9b2b4');
        }
        if (currentPlayer?.id === '0x1215991085d541A586F0e1968355A36E58C9b2b4') {
            setNewPlayerInputValue('0xDb0b11d1281da49e950f89bD0F6B47D464d25F91');
        }
    }, [currentPlayer]);

    const viewers = [{ id: 'id1Viewer' }, { id: 'id2Viewer' }];

    return (
        <div className={styles.game}>
            <div className={styles.leftPanel}>
                <div>
                    Type: {type}{' '}
                    <button onClick={() => setTypeHandler('O')}>Set Type O</button>
                    <button onClick={() => setTypeHandler('X')}>Set Type X</button>
                </div>
                <div>
                    <h2>
                        Players {!!gameState[1] && <span>X won!</span>}
                        {!!gameState[2] && <span>O won!</span>}
                    </h2>
                    <p>
                        {'Current Player: (X)'} {currentPlayer?.id}
                    </p>
                    <p>
                        {'Peer Player: (O)'} : {peerPlayer?.id}
                    </p>
                    <div>
                        <button onClick={addNewPlayerHandler}>Add new Player</button>
                        <input
                            value={newPlayerInputValue}
                            onChange={(event) => setNewPlayerInputValue(event.target.value)}
                        ></input>
                    </div>
                </div>
                <div>
                    <h2>Viewers</h2>
                    {viewers.map(({ id }) => (
                        <Viewer key={id}>{`Viewer: ${id}`}</Viewer>
                    ))}
                </div>
            </div>
            <div>
                <Board
                    squares={gameState[0][gameState[0].length - 1].squares}
                    finished={finished}
                    onClick={(i) => handleClick(i)}
                />
                <div className="game-info">
                    {/* <div>{status}</div> */}
                    {/* <ol>{moves}</ol> */}
                </div>
            </div>
        </div>
    );
}

function calculateWinner(squares: Array<string>) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    const length = lines.length;
    for (let i = 0; i < length; i++) {
        const [a, b, c] = lines[i];
        const player = squares[a];
        if (player && player === squares[b] && player === squares[c]) {
            return player;
        }
    }
    return null;
}

export default App;
