import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Board } from 'components/Games/Tic-Tac-Toe';
import gameApi from 'gameApi';
import { TikTakToePropsI } from './Tic-Tac-ToeProps';
import { calculateWinner } from './utils';
import { defaultAbiCoder } from 'ethers/lib/utils';
import rulesContract from 'contracts/TicTacToeRules.json';
import styles from './Tic-Tac-Toe.module.scss';
import { TCellData, TGameBoardState, TGameState } from './types';
import { TBoardState } from 'types';
import { signMove, getSessionWallet } from 'helpers/session_signatures';
import { ethers } from 'ethers';
export const TicTacToe: React.FC<TikTakToePropsI> = ({
  children,
  // gameState,
  playerIngameId,
  onGameStateChange,
  encodedMessage,
  onChangeMessage,
  gameId,
  onInvalidMove,
  onWinner,
}) => {
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [boardState, setBoardState] = useState<TGameBoardState>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [disputiveMove, setDisputiveMove] = useState<number | null>(null);

  const account = useAccount();
  const cellClickHandler = (i: any) => {
    // onChangeMessage('ecoded message');
    if (isFinished) return;

    const updatedBoardState = [...boardState] as TGameBoardState;
    updatedBoardState[i] = playerIngameId as TCellData;

    const winner = calculateWinner(updatedBoardState);

    setIsFinished(winner !== null);
    onWinner(winner);
    const newGameState = [
      updatedBoardState.map((el) => {
        switch (el) {
          case null:
            return 0;
          case 0:
            return 1;
          case 1:
            return 2;
          default:
            return 0;
        }
      }),
      winner === 0,
      winner === 1,
    ];

    const oldGameState = [
      boardState.map((el) => {
        switch (el) {
          case null:
            return 0;
          case 0:
            return 1;
          case 1:
            return 2;
          default:
            return 0;
        }
      }),
      false,
      false,
    ];
    setBoardState(updatedBoardState);

    const encodedNewGameState = defaultAbiCoder.encode(
      ['uint8[9]', 'bool', 'bool'],
      newGameState,
    );
    const encodedOldGameState = defaultAbiCoder.encode(
      ['uint8[9]', 'bool', 'bool'],
      oldGameState,
    );
    // onGameStateChange(newGameState, i as number);
    const nonce = updatedBoardState.filter((el) => el !== null).length - 1;
    console.log(updatedBoardState);
    const move = updatedBoardState.reduce<null | number>((acc, val, index) => {
      return val !== boardState[index] ? index : acc;
    }, 0)!;

    console.log('move', move);

    const gameMove: { nonce: number; oldState: string; newState: string; move: string } = {
      nonce,
      move: defaultAbiCoder.encode(['uint8'], [move]),
      oldState: encodedOldGameState,
      newState: encodedNewGameState,
    };
    onChangeMessage(encodedNewGameState, gameMove);
  };

  useEffect(() => {
    if (!encodedMessage) return;

    const processIncomingMove = async (gameMove: any, signatures: string[]) => {
      const { newState, oldState, nonce } = gameMove;
      const decodedNewState = defaultAbiCoder.decode(
        ['uint8[9]', 'bool', 'bool'],
        newState,
      ) as TBoardState;

      const decodeOldState = defaultAbiCoder.decode(
        ['uint8[9]', 'bool', 'bool'],
        oldState,
      ) as TBoardState;

      const newBoardState = decodedNewState[0].map((el) => {
        switch (el) {
          case 0:
            return null;
          case 1:
            return 0;
          case 2:
            return 1;
          default:
            return null;
        }
      }) as TGameBoardState;

      const move = newBoardState.reduce<null | number>((acc, val, index) => {
        return val !== boardState[index] ? index : acc;
      }, null);

      const isValidMove = await gameApi.checkIsValidMove(
        gameApi.fromContractData(rulesContract),
        Number(gameId!),
        nonce,
        decodeOldState,
        playerIngameId,
        move!,
      );

      setBoardState(newBoardState);

      if (!isValidMove) {
        console.log('invalid move', gameMove, signatures);
        setDisputiveMove(move);
        onInvalidMove();
        return;
      }

      setBoardState(newBoardState);

      const structureToSign: {
        gameId: number;
        nonce: number;
        player: string;
        oldState: string;
        newState: string;
        move: string;
      } = {
        gameId: Number(gameId),
        nonce: nonce,
        player: encodedMessage.sender,
        oldState,
        newState,
        move: defaultAbiCoder.encode(['uint8'], [move]),
      };

      const signature = await signMove(
        structureToSign,
        await getSessionWallet(
          Number(gameId),
          encodedMessage.sender,
          (wallet: ethers.Wallet) => Promise.resolve(),
        ),
      );

      console.log('incoming message signed back, signature: ', signature);
    };

    if (encodedMessage.content.gameMove) {
      if (encodedMessage.sender !== account.address) {
        processIncomingMove(
          encodedMessage.content.gameMove,
          encodedMessage.content.signatures,
        );
      }
    }
  }, [encodedMessage]);

  return (
    <div className={styles.container}>
      {children}
      <div className={styles.boardPanel}>
        <Board
          squares={boardState}
          onClick={(i) => cellClickHandler(i)}
          isFinished={isFinished}
          disputiveMove={disputiveMove}
        />
      </div>
    </div>
  );
};

// interface IGameMessage {
//   gameId: number;
//   nonce: number;
//   player: string;
//   oldState: string;
//   newState: string;
//   move: string;
// }

// const [playerType, setPlayerType] = useState<'X' | 'O'>('X');

// const [conversation, setConversation] = useState<Conversation | null>(null);
// const [currentPlayer, setCurrentPlayer] = useState<IPlayer | null>(null);
// const [rivalPlayer, setRivalPlayer] = useState<IPlayer | null>(null);
// const [newPlayerInputValue, setNewPlayerInputValue] = useState<string>('');
// const [isLogLoading, setIsLogLoading] = useState<boolean>(false);
// const [log, setLog] = useState<IChatLog[]>([]);

// const { client } = useXmptContext();

// const viewersMock = [{ id: '0x1a712f71e963ba000' }, { id: '0x2b6a6ab5625b76000' }];

// const checkIfOnNetwork = useCallback(
//   async (address: string): Promise<boolean> => {
//     return client?.canMessage(address) || false;
//   },
//   [client],
// );

// const sendMessageHandler = async (state: any) => {
//   const messageText = JSON.stringify(state);
//   if (!conversation) {
//     console.warn('no conversation!');
//     return;
//   }
//   await conversation.send(messageText);
// };

// const cellClickHandler = (i: any) => {
//   if (isFinished) return;
//   boardState[i] = playerType;
//   const winner = calculateWinner(boardState);
//   setIsFinished(!!winner);
//   setWinner(winner);
//   setBoardState([...boardState]);

//   console.log(
//     'click handler',
//     boardState,
//     boardState.map((el) => (!!el ? (el === 'O' ? 2 : 1) : 0)),
//   );

//   const numberedBoardState = boardState.map((el) => (!!el ? (el === 'O' ? 2 : 1) : 0));

//   const gameState = [];

//   const encoded = defaultAbiCoder.encode(
//     ['uint8[9]', 'bool', 'bool'],
//     [numberedBoardState, winner === 'X', winner === 'O'],
//   );
//   sendMessageHandler(encoded);
// };

// const selectPlayerTypeHandler = async (type: 'O' | 'X') => {
//   setPlayerType(type);
//   if (!conversation) {
//     console.warn('no conversation!');
//     return;
//   }
//   if (!!currentPlayer && !!rivalPlayer) {
//     const typeMessage: {
//       message: string;
//       peerPlayer: string;
//       data: { [id: string]: string };
//     } = {
//       message: 'type',
//       peerPlayer: rivalPlayer.id,
//       data: { [currentPlayer.id]: type, [rivalPlayer.id]: type === 'O' ? 'X' : 'O' },
//     };
//     sendMessageHandler(typeMessage);
//   }
// };

// const addRivalPlayerHandler = async () => {
//   const isInNetwork = !!newPlayerInputValue
//     ? await checkIfOnNetwork(newPlayerInputValue)
//     : false;
//   if (!!isInNetwork && !!newPlayerInputValue) {
//     const newConversation = await client?.conversations.newConversation(
//       newPlayerInputValue,
//     )!;
//     if (!newConversation) {
//       console.error('no conversation');
//       return;
//     }
//     setConversation(newConversation);
//   }
// };

// const checkValidMove = async () => {
//   //TODO separate contract agnostic
//   const contract = await connectRulesContract();

//   const gameBoardState = [[0, 0, 0, 0, 0, 0, 0, 0, 0], false, false];
//   const encodedBoardState = defaultAbiCoder.encode(
//     ['uint8[9]', 'bool', 'bool'],
//     gameBoardState,
//   );
//   const state = [0, 0, encodedBoardState];
//   const move = 1; // top middle cell
//   const encodedMove = defaultAbiCoder.encode(['uint8'], [move]);
//   const isMoveValid = await contract.methods.isValidMove(state, 0, encodedMove).call();
// };

// const proposeGameHandler = async () => {
//   const contract = await connectContract();
//   const gameId = await contract.methods
//     .proposeGame('0xDb0b11d1281da49e950f89bD0F6B47D464d25F91')
//     .send({ from: '0x1215991085d541A586F0e1968355A36E58C9b2b4' });
//   console.log('proppsed game', gameId);
// };

// const acceptGameHandler = async () => {
//   const contract = await connectContract();
//   const data = await contract.methods
//     .acceptGame('4')
//     .send({ from: '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91' });
//   console.log('accept data', data);
// };

// useEffect(() => {
//   if (!!client?.address) {
//     setCurrentPlayer({ id: client.address });
//   }
// }, [client]);

// useEffect(() => {
//   if (!!conversation?.peerAddress) {
//     setRivalPlayer({ id: conversation?.peerAddress });
//   }
// }, [conversation]);

// useEffect(() => {
//   const fetchMessages = async () => {
//     if (!conversation) {
//       // console.warn('no conversation');
//       return [];
//     }
//     const msgs = await conversation.messages();
//     const sortedMessages = msgs
//       .sort((msg1, msg2) => msg2.sent!.getTime() - msg1.sent!.getTime())
//       .map(({ id, senderAddress, recipientAddress, sent, content }) => ({
//         id,
//         sender: senderAddress!,
//         recepient: recipientAddress!,
//         timestamp: sent!.getTime(),
//         content,
//       }));
//     return sortedMessages;
//   };
//   setIsLogLoading(true);

//   fetchMessages()
//     .then((data) => {
//       setLog(data!);
//     })
//     .finally(() => {
//       setIsLogLoading(false);
//     });
// }, [conversation]);

// let stream: Stream<Message>;

// useEffect(() => {
//   if (!conversation) {
//     // console.log('no conversation');
//     return;
//   }

//   const streamMessages = async () => {
//     stream = await conversation.streamMessages();

//     for await (const msg of stream) {
//       const messageContent = JSON.parse(msg.content);
//       if (!!messageContent && messageContent.message === 'type') {
//         // setPlayerType(messageContent.data[currentPlayer!.id]);
//       } else {
//         console.log(messageContent);
//         const decoded = defaultAbiCoder.decode(['uint8[9]', 'bool', 'bool'], messageContent);
//         console.log(decoded);

//         // setBoardState([...messageContent]);
//       }
//     }
//     return stream;
//   };

//   streamMessages();
//   return () => {
//     if (!!stream) stream.return();
//   };
// }, [conversation, currentPlayer]);

// if (
//   decodedMessage[0] instanceof Array &&
//   typeof decodedMessage[1] === 'boolean' &&
//   typeof decodedMessage[2] === 'boolean'
// ) {
// const newBoardState = decodedMessage[0].map((el) => {
//   switch (el) {
//     case 0:
//       return null;
//     case 1:
//       return 0;
//     case 2:
//       return 1;
//     default:
//       return null;
//   }
// }) as TGameBoardState;
//   console.log('sender', encodedMessage.sender);
//   if (encodedMessage.sender !== account.address) {
//     console.log('incoming message need to check');

//     console.log('newBoardState', newBoardState);

//     const currnetNonce = newBoardState.filter((el) => el !== null).length;

//     const move = newBoardState.reduce<null | number>((acc, val, index) => {
//       return val !== boardState[index] ? index : acc;
//     }, null);

//     console.log(move);

//     if (move !== null) {
//       const boardToCheck = [
//         boardState.map((el) => {
//           switch (el) {
//             case null:
//               return 0;
//             case 0:
//               return 1;
//             case 1:
//               return 2;
//             default:
//               return 0;
//           }
//         }),
//         false,
//         false,
//       ];
//       console.log('boaradToChecl', boardToCheck);
//       console.log('nonce', currnetNonce);
//       console.log('move', move);
//       console.log('player', playerIngameId);

//       gameApi
//         .checkIsValidMove(
//           gameApi.fromContractData(rulesContract),
//           Number(gameId!),
//           currnetNonce,
//           [
//             boardState.map((el) => {
//               switch (el) {
//                 case null:
//                   return 0;
//                 case 0:
//                   return 1;
//                 case 1:
//                   return 2;
//                 default:
//                   return 0;
//               }
//             }),
//             false,
//             false,
//           ],
//           playerIngameId,
//           move,
//         )
//         .then((isValid) => {
//           console.log('isvalidResponse', isValid);
//           if (!isValid) {
//             onInvalidMove();
//           }
//         });
//     }
//   }
//   setBoardState(newBoardState);
// }
