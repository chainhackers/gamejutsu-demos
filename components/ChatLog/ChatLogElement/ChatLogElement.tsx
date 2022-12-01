import { IChatLogElementProps } from './ChatLogElementProps';
import styles from './ChatLogElement.module.scss';
import { IAnyMessage, IChatLogMessage } from 'types/chat';
import { TicTacToeBoard, TIC_TAC_TOE_MOVE_TYPES } from 'components/Games/Tic-Tac-Toe/types';
import { defaultAbiCoder } from 'ethers/lib/utils';

function formatGameMove(anyMessage: IChatLogMessage): {
  oldState: string;
  newState: string;
  move: string;
  signatures: string;
  nonce: string;
  gameId: string;
} | null {
  let signedGameMove = anyMessage.messageType == 'ISignedGameMove' && anyMessage.message;
  if (!signedGameMove) {
    return null;
  }
  if (anyMessage.gameType == 'tic-tac-toe') {
    return {
      oldState: JSON.stringify(TicTacToeBoard.fromEncoded(signedGameMove.gameMove.oldState)),
      newState: JSON.stringify(TicTacToeBoard.fromEncoded(signedGameMove.gameMove.newState)),
      gameId: signedGameMove.gameMove.gameId.toString(),
      nonce: signedGameMove.gameMove.nonce.toString(),
      move: JSON.stringify(
        defaultAbiCoder.decode(TIC_TAC_TOE_MOVE_TYPES, signedGameMove.gameMove.move),
      ),
      signatures: JSON.stringify(signedGameMove.signatures),
    };
  }

  return null;
}
export const ChatLogElement: React.FC<IChatLogElementProps> = ({ anyMessage }) => {
  const formattedMessage = formatGameMove(anyMessage);
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.title}>Sender:</div>
        <div className={styles.data}>{anyMessage.senderAddress}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Recipient:</div>
        <div className={styles.data}>{anyMessage.recipientAddress}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Date:</div>
        <div className={styles.data}>
          {anyMessage.sent && new Date(anyMessage.sent).toISOString()}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Game Id:</div>
        <div className={styles.data}>{formattedMessage?.gameId}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Nonce:</div>
        <div className={styles.data}>{formattedMessage?.nonce}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Move:</div>
        <div className={styles.data}>{formattedMessage?.move}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Old state:</div>
        <div className={styles.data}>{formattedMessage?.oldState}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>New state:</div>
        <div className={styles.data}>{formattedMessage?.newState}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Signatures:</div>
        <div className={styles.data}>{formattedMessage?.signatures}</div>
      </div>
    </div>
  );
};
