import { XMTPChatLog } from 'components/XMTPChatLog';
import { Viewer, Board } from 'components/Games/Tic-Tac-Toe';
import { IChatLog } from 'types';
import { TikTakToePropsI } from './Tic-Tac-ToeProps';
import { calculateWinner } from './utils';
import styles from './Tic-Tac-Toe.module.scss';
import { useState } from 'react';
export const TicTacToe: React.FC<TikTakToePropsI> = () => {
    const [boardState, setBoardState] = useState<any[]>(new Array(9));
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [winner, setWinner] = useState<'X' | 'O' | null>(null);

    const log: IChatLog[] = [
        {
            id: '0x1215991085d541A586b2b40x1215991085d541A586F0e1968355A36E58C9b2b4',
            sender: '0x1215991085d541A586F0e1968355A36E58C9b2b4',
            recepient: '0x1215991085d541A586F0e1968355A36E58C9b2b4',
            timestamp: 1663108194729,
            content: 'some stuff',
        },
    ];
    const isLogLoading = true;
    const gameState = [[], false, false];
    const currentPlayer = { id: '0x1215991085d541A586F0e1968355A36E58C9b2b4' };
    const peerPlayer = { id: '0x1215991085d541A586F0e1968355A36E58C9b2b4' };
    let type: 'X' | 'O' = 'X';
    const viewers = [{ id: '0x1a712f71e963ba000' }, { id: '0x2b6a6ab5625b76000' }];
    const newPlayerInputValue = '0x1215991085d541A586F0e1968355A36E58C9b2b4';
    // console.log(Date.now());

    const cellClickHandler = (i: any) => {
        if (isFinished) return;

        boardState[i] = type;
        const winner = calculateWinner(boardState);
        setIsFinished(!!winner);
        setWinner(winner);
        setBoardState([...boardState]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div>
                    <h2 className={styles.title}>
                        Players {!!winner && <span>{winner} won!</span>}
                    </h2>
                    <div className={styles.player}>
                        <span>Current Player:</span>{' '}
                        <div>
                            Type: {type}{' '}
                            <button
                                className={styles.typeSelect}
                                // onClick={() => setTypeHandler('O')}
                            >
                                Set Type O
                            </button>
                            <button
                                className={styles.typeSelect}
                                // onClick={() => setTypeHandler('X')}
                            >
                                Set Type X
                            </button>
                        </div>
                        <span>{currentPlayer?.id}</span>
                    </div>
                    {
                        <p className={styles.player}>
                            <span>Peer Player:</span> <span>{peerPlayer?.id}</span>
                        </p>
                    }
                    <div className={styles.addPlayer}>
                        <button
                        // onClick={addNewPlayerHandler}
                        >
                            Add new Player
                        </button>
                        <input
                            // value={newPlayerInputValue}
                            // onChange={(event) => setNewPlayerInputValue(event.target.value)}
                            placeholder="Add rival id"
                        ></input>
                    </div>
                </div>
                <div>
                    <h2 className={styles.title}>Viewers</h2>
                    {viewers.map(({ id }) => (
                        <Viewer key={id}>{`Viewer: ${id}`}</Viewer>
                    ))}
                </div>
            </div>

            <div className={styles.boardPanel}>
                <Board
                    squares={boardState}
                    finished={isFinished}
                    onClick={(i) => cellClickHandler(i)}
                />
            </div>
            <div className={styles.rightPanel}>
                <XMTPChatLog logData={log} isLoading={isLogLoading} />
            </div>
        </div>
    );
};
