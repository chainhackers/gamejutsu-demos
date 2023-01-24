import {defaultAbiCoder} from 'ethers/lib/utils';
import { IGetHistoryProps } from './GetHistoryProps';
import styles from './GetHistory.module.scss';
import { ISignedGameMove } from 'types/arbiter';
import { IAnyMessage } from 'hooks/useConversation';
import {CheckersBoard, CHECKERS_MOVE_TYPES} from 'components/Games/Checkers/types';
import YAML from 'yaml'

export const GetHistory: React.FC<IGetHistoryProps> = ({ history }) => {
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    // console.log('history', history)
    const { gameId, gameType } = history[0];

    const messages = history.map((message) => {
      const { messageType } = message as IAnyMessage;
      const { senderAddress, sent, id } = message.underlyingMessage;

      if (messageType === 'ISignedGameMove') {
        const { gameMove, signatures } = message.message as ISignedGameMove;
        if (gameType === 'tic-tac-toe') {

        }
        if (gameType === 'checkers') {
          const oldState = CheckersBoard.fromEncoded(gameMove.oldState);
          const newState = CheckersBoard.fromEncoded(gameMove.newState);
          const move = JSON.stringify(defaultAbiCoder.decode(CHECKERS_MOVE_TYPES, gameMove.move));
          return {
            senderAddress, sent: sent.toISOString(), id, messageType, nonce: gameMove.nonce, 
            oldState, newState, move, signatures }

        }
        return { senderAddress, sent: sent.toISOString(), id, messageType, nonce: gameMove.nonce, gameMove, signatures }
      }
      
      
      
      return { senderAddress, sent: sent.toISOString(), id, messageType, }
    })

    const formattedMessages = Object.assign(messages[0])
    formattedMessages.oldState.cells = formattedMessages.oldState.cells.map((cell :string) => String(cell)).join()
    formattedMessages.newState.cells = formattedMessages.newState.cells.map((cell :string) => String(cell)).join()
    
    const historyData = {
      gameId,
      gameType,
      
      formattedMessages,
    }

    const historyDataYaml = YAML.stringify([historyData])

    const a = document.createElement("a")
    const file = new Blob([historyDataYaml], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = 'myfilename.txt';
    a.click();


  }
  return (
    <div className={styles.container}>
      <form onSubmit={submitHandler}>
        <div className={styles.inputGroup}>
          <input className={styles.gameIdInput} type='text' placeholder='game id'></input>
          <button className={styles.submitButton} type='submit'>Get History</button>
        </div>
      </form>
    </div>
  )
}