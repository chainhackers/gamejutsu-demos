import { ControlPanelPropsI } from './ControlPanelProps';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './ControlPanel.module.scss';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import gameApi from 'gameApi';
import { TBoardState } from 'types';
import { useEffect, useState } from 'react';
import cn from 'classnames';
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
  const [currentPlayerAddress, setCurrentPlayerAddress] = useState<string | null>(null);
  const [rivalPlayerAddress, setRivalPlayerAddress] = useState<string | null>(null);
  const [playerIngameId, setPlayerIngameId] = useState<number | null>(null);
  const [playerType, setPlayerType] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const account = useAccount();
  const connect = useConnect({
    connector: new InjectedConnector(),
  });

  const proposeGameHandler = async (curentPlayerId: string) => {
    setGameStatus('Proposing...');
    try {
      const { gameId } = await gameApi.proposeGame(arbiterContractData, curentPlayerId);
      if (!!gameId) {
        setGameId(gameId);
        setGameStatus('Proposed');
      }
    } catch (error) {
      console.error('Propose game failed', error);
      setGameStatus('Propose failed, check console and try again');
    }
  };

  const acceptGameHandler = async (curentPlayerId: string, gamdId: string | null) => {
    if (!gamdId) return;
    const acceptedGameData = await gameApi.acceptGame(
      arbiterContractData,
      curentPlayerId,
      gamdId,
    );
    console.log('accepted Game data', acceptedGameData);
    if (!!onAcceptGame) onAcceptGame();
  };

  const submitAcceptGameHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    // @ts-ignore TODO: to solve once it make sense
    const gameId = event.target.children.gameId.value;
    try {
      if (!currentPlayerAddress)
        throw new Error(`No currentPlayerAddress: ${currentPlayerAddress}`);
      const { players } = await gameApi.acceptGame(
        arbiterContractData,
        currentPlayerAddress,
        gameId,
      );

      const fetchedRivalPlayerAddress = players.filter(
        (address) => address !== currentPlayerAddress,
      )[0];
      setRivalPlayerAddress(fetchedRivalPlayerAddress);
    } catch (error) {
      setError('Error! Check console!');
      console.error('Error: ', error);
    }
  };

  const submitRivalAddressHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    // @ts-ignore TODO: to solve once it make sense
    const rivalAddress = event.target.children.rivalAddress.value;
    setRivalPlayerAddress(rivalAddress);
  };

  const getPlayersHandler = async (gamdId: string) => {
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

  // const checkValidMoveHandler = async (
  //   gameId: number,
  //   nonce: number,
  //   boardState: TBoardState,
  //   playerIngameId: number,
  //   move: number,
  // ) => {
  //   const isMoveValid = await gameApi.checkIsValidMove(
  //     gameRulesContractData,
  //     gameId,
  //     nonce,
  //     boardState,
  //     playerIngameId,
  //     move,
  //   );

  //   console.log('isMoveValid', isMoveValid);
  //   if (!!onCheckValidMove) onCheckValidMove();
  // };

  // const transitionHandler = async (
  //   gameId: number,
  //   nonce: number,
  //   boardState: TBoardState,
  //   playerIngameId: number,
  //   move: number,
  // ) => {
  //   const transitionResult = await gameApi.transition(
  //     gameRulesContractData,
  //     gameId,
  //     nonce,
  //     boardState,
  //     playerIngameId,
  //     move,
  //   );
  //   console.log('transitionResult', transitionResult);
  //   if (!!onTransition) onTransition();
  // };

  const connectPeerPlayerHandler = async () => {
    console.log('connect peer player handler');
  };

  useEffect(() => {
    setCurrentPlayerAddress(account.address ? account.address : null);
  }, [account]);

  return (
    <div className={styles.container}>
      <ConnectButton />
      {error && <div className={styles.error}>{error}</div>}
      <div>
        <div className={styles.headTitle}>Game controls</div>
        <div className={styles.block}>
          <div className={styles.blockTitle}>Current player</div>
          <div className={styles.blockData}>
            <span>Player Address:</span>
            <span>
              {currentPlayerAddress ? (
                currentPlayerAddress
              ) : (
                <button className={styles.connectButton} onClick={() => connect.connect()}>
                  Connect
                </button>
              )}
            </span>
          </div>
          <div className={styles.blockData}>
            <span>Player Id:</span>
            <span>
              {playerIngameId ? playerIngameId : 'No ID: propose or accept new game '}
            </span>
          </div>
          <div className={styles.blockData}>
            <span>Player Type:</span>
            <span>{playerType ? playerIngameId : 'No Type: propose or accept new game'}</span>
          </div>
        </div>
        <div className={styles.block}>
          <div className={styles.blockTitle}>Game information</div>
          <div className={styles.blockData}>
            <span>Game status:</span>
            <span>{gameStatus ? gameStatus : 'Propose or accept a game'}</span>
          </div>
          <div className={styles.blockData}>
            <span>Game id:</span>
            <span>{gameId ? gameId : 'Propose or accept a game'}</span>
          </div>
        </div>
        <div className={styles.block}>
          <div className={styles.blockTitle}>Propose new game</div>
          <div>
            <button
              className={styles.button}
              onClick={() => proposeGameHandler(account.address!)}
            >
              PROPOSE GAME
            </button>
          </div>
        </div>
        <div className={styles.block}>
          <div className={styles.blockTitle}>Accept proposed game</div>
          <div className={styles.blockData}>
            <form onSubmit={submitAcceptGameHandler}>
              <button
                className={styles.submitButton}
                onClick={() => acceptGameHandler(account.address!, gameId)}
              >
                Accept game
              </button>
              <input
                className={styles.input}
                name="gameId"
                type="text"
                placeholder={'Input game id...'}
              ></input>
            </form>
          </div>
        </div>
        <div className={styles.block}>
          <div className={styles.blockTitle}>Connect peer player</div>
          <div className={styles.blockData}>
            <form onSubmit={submitRivalAddressHandler}>
              <button
                className={styles.submitButton}
                onClick={() => acceptGameHandler(account.address!, gameId)}
              >
                Submit peer address
              </button>
              <input
                className={styles.input}
                name="rivalAddress"
                type="text"
                placeholder={'Input peer address...'}
              ></input>
            </form>
          </div>
          <div className={cn(styles.blockData, styles.peerAddress)}>
            <span>Peer player address:</span>
            <span>
              {rivalPlayerAddress
                ? rivalPlayerAddress
                : 'Accept game or input rival player address'}
            </span>
          </div>
          <div className={styles.blockData}>
            <button
              className={styles.button}
              disabled={!rivalPlayerAddress}
              onClick={() => connectPeerPlayerHandler()}
            >
              Connect peer player
            </button>
          </div>
        </div>

        {/* <div>
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
        </div> */}
      </div>
    </div>
  );
};
