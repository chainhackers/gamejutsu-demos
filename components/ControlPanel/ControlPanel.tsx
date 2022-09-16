import { ControlPanelPropsI } from './ControlPanelProps';
import styles from './ControlPanel.module.scss';
import { useAccount } from 'wagmi';
import gameApi from 'gameApi';
import { TBoardState } from 'types';
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
  const gameId = '6';
  const account = useAccount();
  const rivalPlayer = {
    id:
      account.address === '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91'
        ? '0x1215991085d541A586F0e1968355A36E58C9b2b4'
        : '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91',
  };

  console.log('account', account.address);

  const proposeGameHandler = async (curentPlayerId: string) => {
    const proposedGameId = await gameApi.proposeGame(arbiterContractData, curentPlayerId);
    console.log('proposed GameId', proposedGameId);
    if (!!onProposeGame) onProposeGame(gameId);
  };

  const acceptGameHandler = async (curentPlayerId: string, gamdId: string) => {
    const acceptedGameData = await gameApi.acceptGame(
      arbiterContractData,
      curentPlayerId,
      gamdId,
    );
    console.log('accepted Game data', acceptedGameData);
    if (!!onAcceptGame) onAcceptGame();
  };

  const getPlayersHandler = async (gamdId: number) => {
    const players = await gameApi.getPlayers(arbiterContractData, gamdId);
    console.log('players', players);
    if (!!onGetPlayers) onGetPlayers();
  };

  const disputeMoveHandler = async (
    gameId: number,
    nonce: number,
    playerAddress: string,
    oldBoardState: TBoardState,
    newBoardState: TBoardState,
    move: number,
    signatures: string[],
  ) => {
    const disputeMoveResult = await gameApi.disputeMove(
      arbiterContractData,
      gameId,
      nonce,
      playerAddress,
      oldBoardState,
      newBoardState,
      move,
      signatures,
    );

    console.log('Dispute move result', disputeMoveResult);

    if (!!onDisputeMove) onDisputeMove();
  };

  const checkValidMoveHandler = async (
    gameId: number,
    nonce: number,
    boardState: TBoardState,
    playerIngameId: number,
    move: number,
  ) => {
    const isMoveValid = await gameApi.checkIsValidMove(
      gameRulesContractData,
      gameId,
      nonce,
      boardState,
      playerIngameId,
      move,
    );

    console.log('isMoveValid', isMoveValid);
    if (!!onCheckValidMove) onCheckValidMove();
  };

  const transitionHandler = async (
    gameId: number,
    nonce: number,
    boardState: TBoardState,
    playerIngameId: number,
    move: number,
  ) => {
    const transitionResult = await gameApi.transition(
      gameRulesContractData,
      gameId,
      nonce,
      boardState,
      playerIngameId,
      move,
    );
    console.log('transitionResult', transitionResult);
    if (!!onTransition) onTransition();
  };

  return (
    <div className={styles.container}>
      <div>
        <div>
          <button onClick={() => proposeGameHandler(account.address!)}>PROPOSE GAME</button>
        </div>
        <div>
          <button onClick={() => acceptGameHandler(account.address!, gameId)}>
            ACCEPT GAME
          </button>
        </div>
        <div>
          <button
            onClick={() =>
              checkValidMoveHandler(5, 0, [[0, 0, 0, 0, 0, 0, 0, 0, 0], false, false], 0, 0)
            }
          >
            CHECK VALID MOVE
          </button>
        </div>
        <div>
          <button
            onClick={() =>
              disputeMoveHandler(
                5,
                1,
                rivalPlayer.id,
                [[0, 0, 1, 0, 0, 0, 0, 0, 0], false, false],
                [[0, 0, 1, 0, 2, 0, 0, 0, 0], false, false],
                2,
                [],
              )
            }
          >
            DISPUTE MOVE
          </button>
        </div>
        <div>
          <button onClick={() => getPlayersHandler(5)}>GET PLAYERS HANDLER</button>
        </div>
        <div>
          <button
            onClick={() =>
              transitionHandler(5, 1, [[0, 0, 1, 0, 0, 0, 0, 0, 0], false, false], 0, 2)
            }
          >
            TRANSITION
          </button>
        </div>
      </div>
    </div>
  );
};
