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
      return arr.map((item :any) => String(item)).join('')
    }
    function formatMoves(arr :any) {
      return arr.map((item: any) => String(item)).join()
    }

  const messages = history.map((message) => {
      const { messageType } = message as IAnyMessage;
      const { senderAddress, sent, id } = message.underlyingMessage;
      
      if (messageType === 'ISignedGameMove') {
        const { gameMove, signatures } = message.message as ISignedGameMove;
        
        if (gameType === 'tic-tac-toe') {
          const oldState :any = {}
          oldState.cells = TicTacToeBoard.fromEncoded(gameMove.oldState).cells
          oldState.crossesWin = TicTacToeBoard.fromEncoded(gameMove.oldState).crossesWin
          oldState.naughtsWin = TicTacToeBoard.fromEncoded(gameMove.oldState).naughtsWin
          const newState :any = {}
          newState.cells = TicTacToeBoard.fromEncoded(gameMove.newState).cells
          newState.crossesWin = TicTacToeBoard.fromEncoded(gameMove.newState).crossesWin
          newState.naughtsWin = TicTacToeBoard.fromEncoded(gameMove.newState).naughtsWin
          oldState.cells = arrayToString(toInt(oldState.cells))
          newState.cells = arrayToString(toInt(newState.cells))
          const move = defaultAbiCoder.decode(TIC_TAC_TOE_MOVE_TYPES, gameMove.move);
          const formattedMove = formatMoves(move);
          
          return {
            senderAddress, sent: sent.toISOString(), id, messageType, nonce: gameMove.nonce, 
            oldState, newState, formattedMove, signatures }
          }
          
          if (gameType === 'checkers') {
            const oldState :any = {}
            oldState.cells = CheckersBoard.fromEncoded(gameMove.oldState).cells
            oldState.winner = CheckersBoard.fromEncoded(gameMove.oldState).winner
            oldState.redMoves = CheckersBoard.fromEncoded(gameMove.oldState).redMoves
            const newState :any = {}
            newState.cells = CheckersBoard.fromEncoded(gameMove.newState).cells
            newState.winner = CheckersBoard.fromEncoded(gameMove.newState).winner
            newState.redMoves = CheckersBoard.fromEncoded(gameMove.newState).redMoves
            oldState.cells = arrayToString(toInt(oldState.cells))
            newState.cells = arrayToString(toInt(newState.cells))
            const move = defaultAbiCoder.decode(CHECKERS_MOVE_TYPES, gameMove.move);
            const formattedMove = formatMoves(move)
            
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
        
        const oldState :any = {}
        oldState.cells = TicTacToeBoard.fromEncoded(argument.gameMove.oldState).cells
        oldState.crossesWin = TicTacToeBoard.fromEncoded(argument.gameMove.oldState).crossesWin
        oldState.naughtsWin = TicTacToeBoard.fromEncoded(argument.gameMove.oldState).naughtsWin
        const newState :any = {}
        newState.cells = TicTacToeBoard.fromEncoded(argument.gameMove.newState).cells
        newState.crossesWin = TicTacToeBoard.fromEncoded(argument.gameMove.newState).crossesWin
        newState.naughtsWin = TicTacToeBoard.fromEncoded(argument.gameMove.newState).naughtsWin
        oldState.cells = arrayToString(toInt(oldState.cells))
        newState.cells = arrayToString(toInt(newState.cells))
        const move = defaultAbiCoder.decode(TIC_TAC_TOE_MOVE_TYPES, argument.signedMove.gameMove.move)
        const formattedMove = formatMoves(move)
  
        const nonce = message.nonce
        const polygonMessageGameMove = message.polygonMessageGameMove
        const polygonMessageSignedMove = message.polygonMessageSignedMove
        const signatureInfo = message.signatureInfo
        return {newState, oldState, formattedMove, nonce, polygonMessageGameMove, polygonMessageSignedMove, signatureInfo}
      }

     if (gameType === 'checkers') {
      const argument = message.message.arguments[0]
      const oldState :any = {}
      oldState.cells = CheckersBoard.fromEncoded(argument.gameMove.oldState).cells
      oldState.winner = CheckersBoard.fromEncoded(argument.gameMove.oldState).winner
      oldState.redMoves = CheckersBoard.fromEncoded(argument.gameMove.oldState).redMoves
      const newState :any = {}
      newState.cells = CheckersBoard.fromEncoded(argument.gameMove.newState).cells
      newState.winner = CheckersBoard.fromEncoded(argument.gameMove.newState).winner
      newState.redMoves = CheckersBoard.fromEncoded(argument.gameMove.newState).redMoves
      oldState.cells = arrayToString(toInt(oldState.cells))
      newState.cells = arrayToString(toInt(newState.cells))
      const move = defaultAbiCoder.decode(CHECKERS_MOVE_TYPES, argument.signedMove.gameMove.move)
      const formattedMove = formatMoves(move)

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
