import { ControlPanelPropsI } from './ControlPanelProps';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './ControlPanel.module.scss';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { getArbiter, getRulesContract } from 'gameApi';
import gameApi from 'gameApi';
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { CheckersBoard, CHECKERSMove, CheckersState } from 'components/Games/Checkers/types';

const PROPOSER_INGAME_ID = '0';
const ACCEPTER_INGAME_ID = '1';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const FETCH_RIVAL_ADDRESS_TIMEOUT = 5000;

//mb this better https://pgarciacamou.medium.com/react-simple-polling-custom-hook-usepollingeffect-1e9b6b8c9c71
export function useInterval(callback: () => any, delay: number | undefined) {
  const savedCallback = useRef<() => any>(() => {});
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const ControlPanel: React.FC<ControlPanelPropsI> = ({
  onAcceptGame,
  onProposeGame,
  onCheckValidMove,
  onDisputeMove,
  onGetPlayers,
  onTransition,
  gameType,
  playersTypes,
  onConnectPlayer,
  onSetPlayerIngameId,
  rivalPlayerConversationStatus,
  finishedGameState,
  isInDispute,
  isInvalidMove,
  onFinishGame,
  onDispute,
  onInitTimeout,
  onResolveTimeout,
  onFinalizeTimeout,
  gameId: gameID,
}) => {
  const [delay, setDelay] = useState(FETCH_RIVAL_ADDRESS_TIMEOUT);
  const [currentPlayerAddress, setCurrentPlayerAddress] = useState<string | null>(null);
  const [rivalPlayerAddress, setRivalPlayerAddress] = useState<string | null>(null);
  // const [rivalPlayerConversationStatus, setRivalPlayerConversationStatus] = useState<
  //   string | null
  // >(null);
  // const rivalPlayerAddress =
  // currentPlayerAddress === '0x1215991085d541A586F0e1968355A36E58C9b2b4'
  //   ? '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91'
  //   : '0x1215991085d541A586F0e1968355A36E58C9b2b4';
  const [rivalAddressStatus, setRivalAddressStatus] = useState<
    'Fetching rival address...' | 'Failed to get rival address' | null
  >(null);
  const [playerIngameId, setPlayerIngameId] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(gameID);
  const account = useAccount();
  const connect = useConnect({
    connector: new InjectedConnector(),
  });

  
  const onClickValidateMove = async () => {
    
    
  }

  const proposeGameHandler = async (curentPlayerId: string) => {
    setRivalPlayerAddress(null);
    setRivalAddressStatus(null);
    setGameId(null);
    setPlayerIngameId(null);
    setGameStatus('Proposing...');

    try {
      let {gameId} = await gameApi.proposeGame(
          getArbiter(),
          getRulesContract(gameType).address,
      );
      if (!!gameId) {
        const id = gameId.toString();
        console.log('gameId', gameId);
        setGameId(id);
        setPlayerIngameId(PROPOSER_INGAME_ID);
        setGameStatus('Proposed');
        onProposeGame(id);
      }
    } catch (error) {
      console.error('Propose game failed', error);
      setGameStatus(null);
      throw 'Propose failed';
    }
  };

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

      const { players } = await gameApi.acceptGame(
        getArbiter(),
        gameId,
      );

      let rivalPlayer = players[parseInt(PROPOSER_INGAME_ID)];

      setRivalPlayerAddress(rivalPlayer);
      setPlayerIngameId(ACCEPTER_INGAME_ID);
      setGameStatus('Accepted');
      setGameId(gameId);
      onAcceptGame(gameId);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const submitResignGameHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    // @ts-ignore TODO: to solve once it make sense
    const gameId = event.target.children.gameId.value;
    try {
      if (!currentPlayerAddress)
        throw new Error(`No currentPlayerAddress: ${currentPlayerAddress}`);
      if (!gameId || gameId.length === 0) throw new Error(`Empty game id`);
      setGameStatus('Resigning...');

      const { winner, loser } = await gameApi.resign(
        getArbiter(),
        gameId,
      );

      setGameId(gameId);
      setGameStatus('Resigned');
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  };

  const submitRivalAddressHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    // @ts-ignore TODO: to solve once it make sense
    const rivalAddress = event.target.children.rivalAddress.value;
    setRivalPlayerAddress(rivalAddress);
  };

  const getPlayersHandler = async (gamdId: string) => {
    const players = (await gameApi.getPlayers(
      getArbiter(),
      gamdId,
    )) as string[];

    if (!!onGetPlayers) onGetPlayers();
  };

  const connectPeerPlayerHandler = async () => {
    console.log('connect peer player handler');
    // onConnectPlayer(rivalPlayerAddress);
    if (rivalPlayerAddress) {
      await onConnectPlayer(rivalPlayerAddress);
    } else {
      console.log('no rival player address');
    }
  };

  useEffect(() => {
    setCurrentPlayerAddress(account.address ? account.address : null);
  }, [account]);

  useInterval(async () => {
    if (rivalPlayerAddress) {
      return;
    }
    if (!gameId) {
      return;
    }
    console.log('in poller');
    let players: [string, string] = await gameApi.getPlayers(
      getArbiter(),
      gameId,
    );
    let rivalPlayer = players[parseInt(ACCEPTER_INGAME_ID)];
    if (rivalPlayer == ZERO_ADDRESS) {
      return;
    }
    if (rivalPlayer) {
      setRivalAddressStatus(null);
      setRivalPlayerAddress(rivalPlayer);
    } else {
      setRivalAddressStatus('Failed to get rival address');
      setRivalPlayerAddress(null);
    }
  }, delay);

  //peraps dependencies [gameId, playerIngameId, rivalPlayerAddress];

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

  // useEffect(() => {
  //     setRivalPlayerAddress(
  //       currentPlayerAddress === '0x1215991085d541A586F0e1968355A36E58C9b2b4'
  //         ? '0xDb0b11d1281da49e950f89bD0F6B47D464d25F91'
  //         : '0x1215991085d541A586F0e1968355A36E58C9b2b4',
  //     );
  //   }, [currentPlayerAddress]);

  // console.log('rivalPlayerAddress', currentPlayerAddress, rivalPlayerAddress);

  return (
    <div className={styles.container}>
      <ConnectButton />
      <div>
        <div className={styles.headTitle}>
          Game controls
          {finishedGameState !== null && (
            <div
              className={cn(
                styles.winner
              )}
            >
              {JSON.stringify(finishedGameState)}
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
            <span>{playerIngameId ? playersTypes[Number(playerIngameId)] : 'No Type: propose or accept new game'}</span>
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
                onClick={() => onClickValidateMove()}
            >
              VALIDATE MOVE
            </button>
            <button
              className={styles.button}
              onClick={() => proposeGameHandler(account.address!)}
            >
              PROPOSE GAME
            </button>

            <button
              className={styles.button}
              style={{ marginLeft: '30px' }}
              onClick={onFinishGame}
            >
              FINISH GAME
            </button>

            <button
              className={styles.button}
              style={{ marginLeft: '30px' }}
              onClick={onDispute}
            >
              {isInDispute ? 'IN DISPUTE' : (isInvalidMove? 'DISPUTE INVALID MOVE' : 'DISPUTE MOVE')}
            </button>

            <button
              className={styles.button}
              style={{ marginLeft: '30px' }}
              onClick={onInitTimeout}
            >
              INIT TIMEOUT
            </button>

            <button
              className={styles.button}
              style={{ marginLeft: '30px' }}
              onClick={onResolveTimeout}
            >
              RESOLVE TIMEOUT
            </button>
            
            <button
              className={styles.button}
              style={{ marginLeft: '30px' }}
              onClick={onFinalizeTimeout}
            >
              FINISH TIMEOUT
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
          <div className={styles.blockTitle}>Resign game</div>
          <div className={styles.blockData}>
            <form onSubmit={submitResignGameHandler}>
              <button className={styles.submitButton} type="submit">
                Resign game
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
              {/* {rivalPlayerAddress} */}
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

        
      </div>
    </div>
  );
};
