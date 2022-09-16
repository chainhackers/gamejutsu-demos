import { ControlPanelPropsI } from './ControlPanelProps';
import styles from './ControlPanel.module.scss';
import { connectContract } from 'components/gameApi';
export const ControlPanel: React.FC<ControlPanelPropsI> = ({
  onAcceptGame,
  onProposeGame,
  onCheckValidMove,
  onDisputeMove,
  onGetPlayers,
  onTransition,
  arbiterContractData,
  gameRulesContractData,
}) => {
  const currentPlayer = { id: '0x1215991085d541A586F0e1968355A36E58C9b2b4' };
  const rivalPlayer = { id: '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91' };
  const proposeGameHandler = async (rivalPlayerId: string, curentPlayerId: string) => {
    const contract = await connectContract(
      arbiterContractData.abi,
      arbiterContractData.address,
    );
    const gameId = await contract.methods
      .proposeGame(rivalPlayerId)
      .send({ from: curentPlayerId });
    console.log('proposed gameId:', gameId);
    if (!!onProposeGame) onProposeGame(gameId);
  };

  const acceptGameHandler = () => {
    console.log('run acceptGameHandler');
    if (!!onAcceptGame) onAcceptGame();
  };

  const checkValidMoveHandler = () => {
    console.log('run checkValidMove');
    if (!!onCheckValidMove) onCheckValidMove();
  };

  const disputeMoveHandler = () => {
    console.log('run disputemovehandler');
    if (!!onDisputeMove) onDisputeMove();
  };

  const getPlayersHandler = () => {
    console.log('run getplayersHandler');
    if (!!onGetPlayers) onGetPlayers();
  };

  const transitionHandler = () => {
    console.log('run transitionHandler');
    if (!!onTransition) onTransition();
  };

  return (
    <div className={styles.container}>
      <div>
        <div>
          <button onClick={() => proposeGameHandler(currentPlayer.id, rivalPlayer.id)}>
            PROPOSE GAME
          </button>
        </div>
        <div>
          <button onClick={acceptGameHandler}>ACCEPT GAME</button>
        </div>
        <div>
          <button onClick={checkValidMoveHandler}>CHECK VALID MOVE</button>
        </div>
        <div>
          <button onClick={disputeMoveHandler}>DISPUTE MOVE</button>
        </div>
        <div>
          <button onClick={getPlayersHandler}>DISPUTE MOVE</button>
        </div>
        <div>
          <button onClick={transitionHandler}>DISPUTE MOVE</button>
        </div>
      </div>
    </div>
  );
};
