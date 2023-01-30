import {defaultAbiCoder} from 'ethers/lib/utils';
import { IGetHistoryProps } from './GetHistoryProps';
import styles from './GetHistory.module.scss';
import { ISignedGameMove } from 'types/arbiter';
import { IAnyMessage } from 'hooks/useConversation';
import {CheckersBoard, CHECKERS_MOVE_TYPES} from 'components/Games/Checkers/types';
import {TicTacToeBoard, TIC_TAC_TOE_MOVE_TYPES} from 'components/Games/Tic-Tac-Toe/types';
import YAML from 'yaml'

export const GetHistory: React.FC<IGetHistoryProps> = ({ history, messageHistory }) => {
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    console.log('messageHistory', messageHistory);
    
    
    event.preventDefault();
    const { gameId, gameType } = history[0];
    function toInt(arr :any) {
      return arr.map((item :any) => {
        if (item === null) return 0
        if (item === 'X') return 1
        if (item === 'O') return 2
      })
    }
    function arrayToString(arr :any) {
      return toInt(arr).map((item :any) => String(item)).join('')
    }
    
    const messages = history.map((message) => {
      console.log(gameType);
      
      const { messageType } = message as IAnyMessage;
      const { senderAddress, sent, id } = message.underlyingMessage;
      
      if (messageType === 'ISignedGameMove') {
        const { gameMove, signatures } = message.message as ISignedGameMove;
        
        if (gameType === 'tic-tac-toe') {
          const oldState = TicTacToeBoard.fromEncoded(gameMove.oldState);
          const newState = TicTacToeBoard.fromEncoded(gameMove.newState);
          oldState.cells = arrayToString(oldState.cells)
          newState.cells = arrayToString(newState.cells)
          const move = defaultAbiCoder.decode(TIC_TAC_TOE_MOVE_TYPES, gameMove.move);
          const formattedMove = arrayToString(move)
          
          return {
            senderAddress, sent: sent.toISOString(), id, messageType, nonce: gameMove.nonce, 
            oldState, newState, formattedMove, signatures }
          }
          
          if (gameType === 'checkers') {
            const oldState = CheckersBoard.fromEncoded(gameMove.oldState);  
            const newState = CheckersBoard.fromEncoded(gameMove.newState);          
            oldState.cells = arrayToString(oldState.cells)
            newState.cells = arrayToString(newState.cells)
            const move = defaultAbiCoder.decode(CHECKERS_MOVE_TYPES, gameMove.move);
            const formattedMove = arrayToString(move)
            
          return {
            senderAddress, sent: sent.toISOString(), id, messageType, nonce: gameMove.nonce, 
            oldState, newState, formattedMove, signatures }
          }
          return { senderAddress, sent: sent.toISOString(), id, messageType, nonce: gameMove.nonce, gameMove, signatures }
        }
        return { senderAddress, sent: sent.toISOString(), id, messageType, }
      })
    console.log('history',messages);
      
    const historyMessages = messageHistory.map((message)=> {
      if (gameType === 'tic-tac-toe') {
        const argument = message.message.arguments[0]
        
        const newState = TicTacToeBoard.fromEncoded(argument.signedMove.gameMove.newState)
        const oldState = TicTacToeBoard.fromEncoded(argument.signedMove.gameMove.oldState)
        const move = defaultAbiCoder.decode(TIC_TAC_TOE_MOVE_TYPES, argument.signedMove.gameMove.move)
        oldState.cells = arrayToString(oldState.cells)
        newState.cells = arrayToString(newState.cells)
        const formattedMove = arrayToString(move)
  
        const nonce = message.nonce
        const polygonMessageGameMove = message.polygonMessageGameMove
        const polygonMessageSignedMove = message.polygonMessageSignedMove
        const signatureInfo = message.signatureInfo
        return {newState, oldState, formattedMove, nonce, polygonMessageGameMove, polygonMessageSignedMove, signatureInfo}
      }

     if (gameType === 'checkers') {
      const argument = message.message.arguments[0]
      
      const newState = CheckersBoard.fromEncoded(argument.signedMove.gameMove.newState)
      const oldState = CheckersBoard.fromEncoded(argument.signedMove.gameMove.oldState)
      const move = defaultAbiCoder.decode(CHECKERS_MOVE_TYPES, argument.signedMove.gameMove.move)
      oldState.cells = arrayToString(oldState.cells)
      newState.cells = arrayToString(newState.cells)
      const formattedMove = arrayToString(move)

      const nonce = message.nonce
      const polygonMessageGameMove = message.polygonMessageGameMove
      const polygonMessageSignedMove = message.polygonMessageSignedMove
      const signatureInfo = message.signatureInfo
      return {newState, oldState, formattedMove, nonce, polygonMessageGameMove, polygonMessageSignedMove, signatureInfo}
    }
    })
    
    const historyData = {
      gameId,
      gameType,
      messages,
      historyMessages,
    }

    const currentDate = new Date();
    const formattedDate = currentDate.getDate() + "." + (currentDate.getMonth() + 1) + "." + currentDate.getFullYear()
     + "_" + currentDate.getHours() + "." + currentDate.getMinutes();

    const historyDataYaml = YAML.stringify(historyData)

    const a = document.createElement("a")
    const file = new Blob([historyDataYaml], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = `gamerecord_${formattedDate}.txt`;
    a.click();
  }
  return (
    <div className={styles.container}>
      <form onSubmit={submitHandler}>
        <div className={styles.inputGroup}>
          <input className={styles.gameIdInput} type='text' placeholder='game id'></input>
          <button className={styles.submitButton} type='submit'>Download game record</button>
        </div>
      </form>
    </div>
  )
}
