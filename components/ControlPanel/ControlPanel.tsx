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
  const [gameStatus, setGameStatus] = useState<
    | 'Proposed'
    | 'Proposing...'
    | 'Accepted'
    | 'Accepting...'
  | 'Resigned'
    | 'Resigning...'
    | 'Propose failed, check console'
    | 'Accepting failed, check console'
    | 'Resigne failed, check console'
    | null
  >(null);
  const [gameId, setGameId] = useState<string | null>(gameID);
  const [error, setError] = useState<string | null>(null);

  const account = useAccount();
  const connect = useConnect({
    connector: new InjectedConnector(),
  });

  
  const onClickValidateMove = async () => {
    let checkersState = new CheckersState(49, 'O');
    let opponentState = new CheckersState(49, 'X');
    console.log('checkersState', checkersState);
    let contractParams = checkersState.toGameStateContractParams();
    console.log('contractParams', contractParams);
    console.log('decoded state', CheckersBoard.fromEncoded(contractParams.state));
    let move = CHECKERSMove.fromMove([23, 19, false, true], 'O');
    //let move = CHECKERSMove.fromMove([18, 15, false, true], 'O');
    console.log('encodedMove', move.encodedMove);
    let response = await gameApi.checkIsValidMove(
      getRulesContract('checkers'),
      contractParams, 1, move.encodedMove);
    console.log('response' , response); 
    let gameMove = checkersState.composeMove(move, "0x37423721aC069f09d6Cc1274aEd00b205b771678", null);
    let nextOpponentState = opponentState.makeMove(move, true, null);
    console.assert(gameMove.oldState == contractParams.state, 'mismatched states d equal to contractParams.state', gameMove.oldState);
    console.assert(gameMove.move == move.encodedMove, 'mismatched moves', gameMove.move);
    console.log('gameMove.newState', CheckersBoard.fromEncoded(gameMove.newState));
    let response2 = await gameApi.isValidGameMove(getArbiter(), gameMove);
    console.log('response2' , response2);
    let response3 = await gameApi.transition(
      getRulesContract('checkers'),
      contractParams, 1, move.encodedMove);
    console.log('response3', response3);
    console.assert(response3[2] == gameMove.newState);
    console.log('fromContract', CheckersBoard.fromEncoded(response3[2]));
    console.log('fromTs', CheckersBoard.fromEncoded(gameMove.newState));

    let secondMove = CHECKERSMove.fromMove([11, 15, false, true], 'X');
    let response4 = await gameApi.checkIsValidMove(
      getRulesContract('checkers'),
      nextOpponentState.toGameStateContractParams(), 0, secondMove.encodedMove);
    console.log('response4' , response4);
    let opponentGameMove = nextOpponentState.composeMove(secondMove, "0x3Be65C389F095aaa50D0b0F3801f64Aa0258940b", null);
    console.assert(opponentGameMove.oldState ==  nextOpponentState.toGameStateContractParams().state, 'mismatched states d equal to contractParams.state', gameMove.oldState);
    console.assert(opponentGameMove.move == secondMove.encodedMove, 'mismatched moves', opponentGameMove);
    console.log('opponentGameMove.oldState', CheckersBoard.fromEncoded(opponentGameMove.oldState));
    console.log('opponentGameMove.newState', CheckersBoard.fromEncoded(opponentGameMove.newState));
    let response5 = await gameApi.isValidGameMove(getArbiter(), opponentGameMove);
    console.log('response5' , response5);
    
  }

  const proposeGameHandler = async (curentPlayerId: string) => {
    setGameStatus('Proposing...');
    setRivalPlayerAddress(null);
    setRivalAddressStatus(null);
    setGameId(null);
    setError(null);
    setPlayerIngameId(null);

    try {
      let { gameId } = await gameApi.proposeGame(
        getArbiter(),
        getRulesContract(gameType).address,
      );
      if (!!gameId) {
        gameId = gameId.toString();
        console.log('gameId', gameId);
        setGameId(gameId);
        setPlayerIngameId(PROPOSER_INGAME_ID);
        setGameStatus('Proposed');
        onProposeGame(gameId);
      }
    } catch (error) {
      console.error('Propose game failed', error);
      setGameStatus('Propose failed, check console');
      setError('Proposing failed');
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
      setError(null);

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
      setError('Error! Check console!');
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
      setError(null);

      const { winner, loser } = await gameApi.resign(
        getArbiter(),
        gameId,
      );

      setGameId(gameId);
      setGameStatus('Resigned');
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
      {error && <div className={styles.error}>{error}</div>}

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
