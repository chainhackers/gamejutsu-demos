import { ControlPanelPropsI } from './ControlPanelProps';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './ControlPanel.module.scss';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import gameApi from 'gameApi';
import { TBoardState } from 'types';
import { useEffect, useState } from 'react';
import cn from 'classnames';

const PROPOSER_INGAME_ID = '0';
const ACCEPTER_INGAME_ID = '1';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const FETCH_RIVAL_ADDRESS_TIMEOUT = 5000;

export const ControlPanel: React.FC<ControlPanelPropsI> = ({
  onAcceptGame,
  onProposeGame,
  onCheckValidMove,
  onDisputeMove,
  onGetPlayers,
  onTransition,
  arbiterContractData,
  gameRulesContractData,
  playersTypes,
  onConnectPlayer,
  onSetPlayerIngameId,
  rivalPlayerConversationStatus,
  winner,
}) => {
  console.log('cp winner', winner);
  console.log('rivalPlaea', rivalPlayerConversationStatus);
  const [currentPlayerAddress, setCurrentPlayerAddress] = useState<string | null>(null);
  const [rivalPlayerAddress, setRivalPlayerAddress] = useState<string | null>(null);
  // const [rivalPlayerConversationStatus, setRivalPlayerConversationStatus] = useState<
  //   string | null
  // >(null);
  // const rivalPlayerAddress =
  //   currentPlayerAddress === '0x1215991085d541A586F0e1968355A36E58C9b2b4'
  //     ? '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91'
  //     : '0x1215991085d541A586F0e1968355A36E58C9b2b4';
  const [rivalAddressStatus, setRivalAddressStatus] = useState<
    'Fetching rival address...' | 'Failed to get rival address' | null
  >(null);
  const [playerIngameId, setPlayerIngameId] = useState<string | null>(null);
  const [playerType, setPlayerType] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<
    | 'Proposed'
    | 'Proposing...'
    | 'Accepted'
    | 'Accepting...'
    | 'Propose failed, check console'
    | 'Accepting failed, check console'
    | null
  >(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const account = useAccount();
  const connect = useConnect({
    connector: new InjectedConnector(),
  });

  const proposeGameHandler = async (curentPlayerId: string) => {
    setGameStatus('Proposing...');
    setRivalPlayerAddress(null);
    setRivalAddressStatus(null);
    setGameId(null);
    setError(null);
    setPlayerType(null);
    setPlayerIngameId(null);

    try {
      const { gameId } = await gameApi.proposeGame(arbiterContractData, curentPlayerId);
      if (!!gameId) {
        setGameId(gameId);
        setPlayerIngameId(PROPOSER_INGAME_ID);
        setPlayerType(playersTypes[PROPOSER_INGAME_ID]);
        setGameStatus('Proposed');
      }
    } catch (error) {
      console.error('Propose game failed', error);
      setGameStatus('Propose failed, check console');
      setError('Proposing failed');
    }
  };

  // const acceptGameHandler = async (curentPlayerId: string, gameId: string | null) => {
  // setGameStatus('Accepting...');
  // console.log(gameId);
  // try {
  //   if (!gameId) throw new Error(`Empty game id`);
  //   const acceptedGameData = await gameApi.acceptGame(
  //     arbiterContractData,
  //     curentPlayerId,
  //     gameId,
  //   );
  //   setGameId(gameId);
  //   setGameStatus('Accepted');
  // } catch (error) {
  //   console.error('Accepting game failed', error);
  //   setGameStatus('Accepting failed, check console');
  //   setError('Accepting failed');
  // }
  // };

  const submitAcceptGameHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    // @ts-ignore TODO: to solve once it make sense
    const gameId = event.target.children.gameId.value;
    try {
      if (!currentPlayerAddress)
        throw new Error(`No currentPlayerAddress: ${currentPlayerAddress}`);
      if (!gameId || gameId.length === 0) throw new Error(`Empty game id`);
      setRivalPlayerAddress(null);
      setRivalAddressStatus(null);
      setGameId(null);
      setGameStatus('Accepting...');
      setError(null);

      const { players } = await gameApi.acceptGame(
        arbiterContractData,
        currentPlayerAddress,
        gameId,
      );

      const fetchedRivalPlayerAddress = players.filter(
        (address) => address !== currentPlayerAddress,
      )[0];
      setRivalPlayerAddress(fetchedRivalPlayerAddress);
      setPlayerIngameId(ACCEPTER_INGAME_ID);
      setPlayerType(playersTypes[ACCEPTER_INGAME_ID]);
      setGameStatus('Accepted');
      setGameId(gameId);
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
    const players = (await gameApi.getPlayers(arbiterContractData, gamdId)) as string[];

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
    // onConnectPlayer(rivalPlayerAddress);
    if (!rivalPlayerAddress) return;
    onConnectPlayer(rivalPlayerAddress);
  };

  useEffect(() => {
    setCurrentPlayerAddress(account.address ? account.address : null);
  }, [account]);

  useEffect(() => {
    if (!gameId || !!rivalPlayerAddress || playerIngameId === ACCEPTER_INGAME_ID) return;
    setRivalAddressStatus('Fetching rival address...');

    const getRivalPlayerLoop = async (timeout: NodeJS.Timeout) => {
      clearTimeout(timeout);
      try {
        const players = (await gameApi.getPlayers(arbiterContractData, gameId)) as [
          string,
          string,
        ];

        const zeroPlayer = players.find((player) => player === ZERO_ADDRESS);

        if (!zeroPlayer) {
          setRivalAddressStatus(null);
          setRivalPlayerAddress(
            players.filter((address) => address !== currentPlayerAddress)[0],
          );

          return;
        }
        const newTimeout: NodeJS.Timeout = setTimeout(
          () => getRivalPlayerLoop(newTimeout),
          FETCH_RIVAL_ADDRESS_TIMEOUT,
        );
      } catch (error) {
        setRivalPlayerAddress(null);
        setRivalAddressStatus('Failed to get rival address');
      }
    };

    const timeout: NodeJS.Timeout = setTimeout(
      () => getRivalPlayerLoop(timeout),
      FETCH_RIVAL_ADDRESS_TIMEOUT,
    );

    return () => clearTimeout(timeout);
  }, [gameId, playerIngameId, rivalPlayerAddress]);

  useEffect(() => {
    // setPlayerIngameId(playerIngameId);
    onSetPlayerIngameId(Number(playerIngameId));
    // currentPlayerAddress === '0x1215991085d541A586F0e1968355A36E58C9b2b4'
    //   ? '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91'
    //   : '0x1215991085d541A586F0e1968355A36E58C9b2b4';
    // setPlayerIngameId(
    //   currentPlayerAddress === '0x1215991085d541A586F0e1968355A36E58C9b2b4' ? '0' : '1',
    // );
    // onSetPlayerIngameId(
    //   currentPlayerAddress === '0x1215991085d541A586F0e1968355A36E58C9b2b4' ? 0 : 1,
    // );
  }, [playerIngameId]);

  return (
    <div className={styles.container}>
      <ConnectButton />
      {error && <div className={styles.error}>{error}</div>}

      <div>
        <div className={styles.headTitle}>
          Game controls
          {winner !== null && (
            <div
              className={cn(
                styles.winner,
                playerIngameId === String(winner) ? styles.win : styles.lose,
              )}
            >
              You {playerIngameId === String(winner) ? 'win!' : 'lose!'}
              {/* {playersTypes[winner]} player wins! */}
            </div>
          )}
        </div>
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
            <span>{playerType ? playerType : 'No Type: propose or accept new game'}</span>
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
              <button className={styles.submitButton} type="submit">
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
              <button className={styles.submitButton} type="submit">
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
              {rivalAddressStatus
                ? rivalAddressStatus
                : rivalPlayerAddress
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
            {!!rivalPlayerAddress && (
              <span className={styles.connectPlayerStatus}>
                {rivalPlayerConversationStatus}
              </span>
            )}
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
