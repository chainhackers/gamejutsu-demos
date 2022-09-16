import { useEffect, useState, useCallback } from 'react';
import { XMTPChatLog } from 'components/XMTPChatLog';
import { Viewer, Board } from 'components/Games/Tic-Tac-Toe';
import { IChatLog } from 'types';
import { TikTakToePropsI } from './Tic-Tac-ToeProps';
import { calculateWinner } from './utils';
import { useXmptContext } from 'context/XmtpContext';
import styles from './Tic-Tac-Toe.module.scss';
import { BigNumber, ethers } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { connectContract, connectRulesContract } from './utils';
import { IPlayer } from 'types';
import { Conversation, Stream, Message } from '@xmtp/xmtp-js';
import { ControlPanel } from 'components/ControlPanel';
import web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract, ContractInterface } from 'ethers';
import arbiterContract from 'contracts/arbiter.json';
import rulesContract from 'contracts/TicTacToeRules.json';
interface IGameMessage {
  gameId: number;
  nonce: number;
  player: string;
  oldState: string;
  newState: string;
  move: string;
}

export const TicTacToe: React.FC<TikTakToePropsI> = () => {
  const [boardState, setBoardState] = useState<any[]>([...new Array(9)]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [winner, setWinner] = useState<'X' | 'O' | null>(null);
  const [playerType, setPlayerType] = useState<'X' | 'O'>('X');

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer | null>(null);
  const [rivalPlayer, setRivalPlayer] = useState<IPlayer | null>(null);
  const [newPlayerInputValue, setNewPlayerInputValue] = useState<string>('');
  const [isLogLoading, setIsLogLoading] = useState<boolean>(false);
  const [log, setLog] = useState<IChatLog[]>([]);

  const { client } = useXmptContext();

  const viewersMock = [{ id: '0x1a712f71e963ba000' }, { id: '0x2b6a6ab5625b76000' }];

  const checkIfOnNetwork = useCallback(
    async (address: string): Promise<boolean> => {
      return client?.canMessage(address) || false;
    },
    [client],
  );

  const sendMessageHandler = async (state: any) => {
    const messageText = JSON.stringify(state);
    if (!conversation) {
      console.warn('no conversation!');
      return;
    }
    await conversation.send(messageText);
  };

  const cellClickHandler = (i: any) => {
    if (isFinished) return;
    boardState[i] = playerType;
    const winner = calculateWinner(boardState);
    setIsFinished(!!winner);
    setWinner(winner);
    setBoardState([...boardState]);

    console.log(
      'click handler',
      boardState,
      boardState.map((el) => (!!el ? (el === 'O' ? 2 : 1) : 0)),
    );

    const numberedBoardState = boardState.map((el) => (!!el ? (el === 'O' ? 2 : 1) : 0));

    const gameState = [];

    const encoded = defaultAbiCoder.encode(
      ['uint8[9]', 'bool', 'bool'],
      [numberedBoardState, winner === 'X', winner === 'O'],
    );
    sendMessageHandler(encoded);
  };

  const selectPlayerTypeHandler = async (type: 'O' | 'X') => {
    setPlayerType(type);
    if (!conversation) {
      console.warn('no conversation!');
      return;
    }
    if (!!currentPlayer && !!rivalPlayer) {
      const typeMessage: {
        message: string;
        peerPlayer: string;
        data: { [id: string]: string };
      } = {
        message: 'type',
        peerPlayer: rivalPlayer.id,
        data: { [currentPlayer.id]: type, [rivalPlayer.id]: type === 'O' ? 'X' : 'O' },
      };
      sendMessageHandler(typeMessage);
    }
  };

  const addRivalPlayerHandler = async () => {
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

  const checkValidMove = async () => {
    //TODO separate contract agnostic
    const contract = await connectRulesContract();

    const gameBoardState = [[0, 0, 0, 0, 0, 0, 0, 0, 0], false, false];
    const encodedBoardState = defaultAbiCoder.encode(
      ['uint8[9]', 'bool', 'bool'],
      gameBoardState,
    );
    const state = [0, 0, encodedBoardState];
    const move = 1; // top middle cell
    const encodedMove = defaultAbiCoder.encode(['uint8'], [move]);
    const isMoveValid = await contract.methods.isValidMove(state, 0, encodedMove).call();

    console.log('isMoveValid', isMoveValid);
  };

  const proposeGameHandler = async () => {
    const contract = await connectContract();
    const gameId = await contract.methods
      .proposeGame('0xDb0b11d1281da49e950f89bD0F6B47D464d25F91')
      .send({ from: '0x1215991085d541A586F0e1968355A36E58C9b2b4' });
    console.log('proppsed game', gameId);
  };

  const acceptGameHandler = async () => {
    const contract = await connectContract();
    const data = await contract.methods
      .acceptGame('4')
      .send({ from: '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91' });
    console.log('accept data', data);
  };

  const getContract = async () => {
    const contract = await connectContract();

    console.log('contract', contract);
  };
  getContract();

  useEffect(() => {
    if (!!client?.address) {
      setCurrentPlayer({ id: client.address });
    }
  }, [client]);

  useEffect(() => {
    if (!!conversation?.peerAddress) {
      setRivalPlayer({ id: conversation?.peerAddress });
    }
  }, [conversation]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation) {
        console.warn('no conversation');
        return [];
      }
      const msgs = await conversation.messages();
      const sortedMessages = msgs
        .sort((msg1, msg2) => msg2.sent!.getTime() - msg1.sent!.getTime())
        .map(({ id, senderAddress, recipientAddress, sent, content }) => ({
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
  }, [conversation]);

  let stream: Stream<Message>;

  useEffect(() => {
    if (!conversation) {
      console.log('no conversation');
      return;
    }

    const streamMessages = async () => {
      stream = await conversation.streamMessages();

      for await (const msg of stream) {
        const messageContent = JSON.parse(msg.content);
        if (!!messageContent && messageContent.message === 'type') {
          setPlayerType(messageContent.data[currentPlayer!.id]);
        } else {
          console.log(messageContent);
          const decoded = defaultAbiCoder.decode(['uint8[9]', 'bool', 'bool'], messageContent);
          console.log(decoded);

          // setBoardState([...messageContent]);
        }
      }
      return stream;
    };

    streamMessages();
    return () => {
      if (!!stream) stream.return();
    };
  }, [conversation, currentPlayer]);

  return (
    <div className={styles.container}>
      <ControlPanel
        arbiterContractData={{
          abi: arbiterContract.abi as AbiItem[],
          address: arbiterContract.address,
        }}
        gameRulesContractData={{
          abi: rulesContract.abi as AbiItem[],
          address: rulesContract.address,
        }}
      />
      <div className={styles.leftPanel}>
        <div>
          <button onClick={proposeGameHandler}>PROPOSE GAME</button>
        </div>
        <div>
          <button onClick={acceptGameHandler}>ACCEPT GAME</button>
        </div>
        <div>
          <button onClick={checkValidMove}>CHECK VALID MOVE</button>
        </div>
        <div>
          <h2 className={styles.title}>Players {!!winner && <span>{winner} won!</span>}</h2>
          <div className={styles.player}>
            <span>Current Player:</span>{' '}
            <div>
              Type: {playerType}{' '}
              <button
                className={styles.typeSelect}
                onClick={() => selectPlayerTypeHandler('O')}
              >
                Set Type O
              </button>
              <button
                className={styles.typeSelect}
                onClick={() => selectPlayerTypeHandler('X')}
              >
                Set Type X
              </button>
            </div>
            <span>{currentPlayer?.id}</span>
          </div>
          {
            <p className={styles.player}>
              <span>Peer Player:</span> <span>{rivalPlayer?.id}</span>
            </p>
          }
          <div className={styles.addPlayer}>
            <button onClick={addRivalPlayerHandler}>Add new Player</button>
            <input
              value={newPlayerInputValue}
              onChange={(event) => setNewPlayerInputValue(event.target.value)}
              placeholder="Add rival id"
            ></input>
          </div>
        </div>
        <div>
          <h2 className={styles.title}>Viewers</h2>
          {viewersMock.map(({ id }) => (
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
