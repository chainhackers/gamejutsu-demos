import { useEffect, useState, useRef } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { ParsedUrlQuery } from 'querystring';
import { XMTPChatLog } from 'components/XMTPChatLog';
import {
  GameField,
  JoinGame,
  LeftPanel,
  RightPanel,
  SelectGame,
  SelectPrize,
} from 'components';

import styles from 'pages/games/gameType.module.scss';
import { TicTacToe, PlayerType as TicTacToePlayerType } from "components/Games/Tic-Tac-Toe";
import { TicTacToeState } from "components/Games/Tic-Tac-Toe/types";
import gameApi, { _isValidSignedMove, getArbiter, getSigner, getRulesContract, finishGame, disputeMove, initTimeout, resolveTimeout, finalizeTimeout, FinishedGameState } from "../../gameApi";
import { ISignedGameMove, SignedGameMove } from "../../types/arbiter";
import { signMoveWithAddress } from 'helpers/session_signatures';
import { useAccount } from 'wagmi';
import { Checkers, PlayerType as CheckersPlayerType } from 'components/Games/Checkers';
import { CheckersState } from 'components/Games/Checkers/types';
import { IGameState, TPlayer } from 'components/Games/types';
import { GameProposedEvent, GameProposedEventObject } from "../../.generated/contracts/esm/types/polygon/Arbiter";
import { BigNumber } from 'ethers';
import { useInterval } from 'hooks/useInterval';
import useConversation from "../../hooks/useConversation";
import { PlayerI, TGameType } from 'types/game';

interface IGamePageProps {
  gameType: TGameType,
  version?: string;
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}
const PROPOSER_INGAME_ID = 0;
const ACCEPTER_INGAME_ID = 1;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const FETCH_OPPONENT_ADDRESS_TIMEOUT = 2500;

const Game: NextPage<IGamePageProps> = ({ gameType, version }) => {

  const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0);
  const [isInDispute, setIsInDispute] = useState<boolean>(false);
  const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);

  const [isDisputAvailable, setIsDisputeAvailavle] = useState<boolean>(false);

  const [opponentAddress, setOpponentAddress] = useState<string | null>(null,);


  const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerI[]>([]);


  const [isTimeoutInited, setIsTimeoutInited] = useState<boolean>(false);
  const [isResolveTimeOutAllowed, setIsResolveTimeOutAllowed] = useState<boolean>(false);
  const [isFinishTimeoutAllowed, setIsFinishTimeoutAllowed] = useState<boolean>(false);
  const [isTimeoutRequested, setIsTimeoutRequested] = useState<boolean>(false);

  const [finishGameCheckResult, setFinishGameCheckResult] = useState<null | { winner: boolean}>(null)

  const { query } = useRouter();
  const account = useAccount();

  const playersTypesMap: { [id in TGameType]: { 0: JSX.Element, 1: JSX.Element}} = {
    'tic-tac-toe': {
      0: <TicTacToePlayerType playerIngameId={0}/>,
      1: <TicTacToePlayerType playerIngameId={1}/>,
    }, 'checkers': {
      0: <CheckersPlayerType playerIngameId={0}/>,
      1: <CheckersPlayerType playerIngameId={1}/>,
    }
  }

  const gameId = parseInt(query.game as string);

  const getInitialState = () => {
    const playerType: TPlayer = playerIngameId === 0 ? 'X' : 'O'
    if (gameType == 'tic-tac-toe') {
      return new TicTacToeState({ gameId, playerType })
    }
    return new CheckersState({ gameId, playerType })
  }

  let gameState: IGameState<any, any>;
  let setGameState: ((arg0: any) => void);

  [gameState, setGameState] = useState<IGameState<any, any>>(getInitialState());

  let { loading, collectedMessages, sendMessage, lastMessages, initClient, client } = useConversation(
    opponentAddress!,
    gameId,
    true
  )

  const setConversationHandler = async (opponentAddress: string) => {
    console.log("setConversationHandler", opponentAddress);
    if (!gameId) {
      throw "No gameId"
    }
    if (!opponentAddress) {
      console.error('cant connect: no opponent address');
      return;
    }
    setOpponentAddress(opponentAddress);
    initClient(await getSigner())
  };

  const sendSignedMoveHandler = async (signedMove: ISignedGameMove) => {
    sendMessage({
      gameId: gameId,
      message: signedMove,
      messageType: 'ISignedGameMove',
      gameType
    })
  };

  const runFinishGameHandler = async (nextGameState: IGameState<any, any>) => {
    if (!nextGameState.lastOpponentMove) {
      throw 'no lastOpponentMove';
    }
    if (!nextGameState.lastMove) {
      throw 'no lastMove'
    }

    let address = await (await getSigner()).getAddress();
    const signature = await signMoveWithAddress(nextGameState.lastOpponentMove.gameMove, address);
    const signatures = [...nextGameState.lastOpponentMove.signatures, signature];
    let lastOpponentMoveSignedByAll = new SignedGameMove(
      nextGameState.lastOpponentMove.gameMove,
      signatures,
    );

    const finishedGameResult = await finishGame(await getArbiter(), [
      lastOpponentMoveSignedByAll,
      nextGameState.lastMove,
    ]);
    sendMessage({
      gameId: gameId,
      message: finishedGameResult,
      messageType: 'FinishedGameState',
      gameType
    })
    setFinishGameCheckResult(null);
    setFinishedGameState(finishedGameResult);
  };

  const initTimeoutHandler = async () => {
    if (!gameState.lastOpponentMove) {
      throw 'no lastOpponentMove';
    }
    if (!gameState.lastMove) {
      throw 'no lastMove'
    }
    setIsTimeoutInited(true);
    setIsFinishTimeoutAllowed(true);
    setIsResolveTimeOutAllowed(false);
    try {
      let address = await (await getSigner()).getAddress();
      const signature = await signMoveWithAddress(gameState.lastOpponentMove.gameMove, address);
      const signatures = [...gameState.lastOpponentMove.signatures, signature];
      let lastOpponentMoveSignedByAll = new SignedGameMove(
        gameState.lastOpponentMove.gameMove,
        signatures,
      );
      console.log('lastOpponentMoveSignedByAll', lastOpponentMoveSignedByAll);

      const initTimeoutResult = await initTimeout(await getArbiter(), [
        lastOpponentMoveSignedByAll,
        gameState.lastMove,
      ]);

      sendMessage({
        gameId: gameId,
        message: initTimeoutResult,
        messageType: 'TimeoutStartedEvent',
        gameType
      })
    } catch (error) {
      setIsTimeoutInited(false);
      setIsFinishTimeoutAllowed(false);
      setIsResolveTimeOutAllowed(false);
      throw error;
    }
  };

  const resolveTimeoutHandler = async () => {
    if (!gameState.lastMove) {
      throw Error('no lastMove');
    }
    const resolveTimeoutResult = await resolveTimeout(await getArbiter(), gameState.lastMove);
    console.log('resolveTimeoutResult', resolveTimeoutResult);
    sendMessage({
      gameId: gameId,
      message: resolveTimeoutResult,
      messageType: 'TimeoutResolvedEvent',
      gameType
    })
    setIsTimeoutInited(false);
    setIsResolveTimeOutAllowed(false);
    setIsFinishTimeoutAllowed(false);
    setIsTimeoutRequested(false);
  };

  const createNewGameHandler = async (isPaid: boolean = false) => {

    let proposeGameResult: GameProposedEventObject = await gameApi.proposeGame(
      await getArbiter(),
      (await getRulesContract(gameType)).address,
      isPaid,
    );

    sendMessage({
      gameId: proposeGameResult.gameId.toNumber(),
      message: proposeGameResult,
      messageType: 'GameProposedEvent',
      gameType
    })

    setPlayerIngameId(PROPOSER_INGAME_ID);
    return proposeGameResult.gameId.toNumber();
  }

  const acceptGameHandler = async (acceptedGameId: number, stake: string): Promise<void> => {
    if (!account) {
      throw new Error(`No wallet`);
    }
    if (!acceptedGameId) {
      throw new Error(`No game id`);
    }
    const acceptGameResult = await gameApi.acceptGame(
      await getArbiter(),
      BigNumber.from(acceptedGameId),
      stake,
    );

    sendMessage({
      gameId: acceptGameResult.gameId.toNumber(),
      message: acceptGameResult,
      messageType: 'GameStartedEvent',
      gameType
    })

    let opponent = acceptGameResult.players[PROPOSER_INGAME_ID];
    setOpponentAddress(opponent);
    setPlayerIngameId(ACCEPTER_INGAME_ID);
  };

  const finishTimeoutHandler = async () => {
    try {
      const finishedGameResult = await finalizeTimeout(await getArbiter(), BigNumber.from(gameId));
      sendMessage({
        gameId: gameId,
        message: finishedGameResult,
        messageType: 'FinishedGameState',
        gameType
      })

      setFinishedGameState(finishedGameResult);
      setIsTimeoutInited(false);
      setIsFinishTimeoutAllowed(false);
      setIsTimeoutRequested(false);
    } catch (error) {
      throw error;
    }
  };

  const runDisputeHandler = async () => {
    if (!gameState.lastOpponentMove) {
      throw 'no lastOpponentMove';
    }

    setIsInDispute(true);

    const finishedGameResult = await disputeMove(await getArbiter(), gameState.lastOpponentMove);
    sendMessage({
      gameId: gameId,
      message: finishedGameResult,
      messageType: 'FinishedGameState',
      gameType
    })

    setFinishedGameState(finishedGameResult);
    setIsInDispute(false);
  };


  async function processOneMessage(i: number) {//TODO
    const lastMessage = lastMessages[i];
    if (lastMessage.messageType === 'TimeoutStartedEvent') {
      setIsTimeoutInited(true);
      setIsResolveTimeOutAllowed(true);
      setIsFinishTimeoutAllowed(true);
      setIsTimeoutRequested(true);
    } else if (lastMessage.messageType === 'TimeoutResolvedEvent') {
      setIsTimeoutInited(false);
      setIsResolveTimeOutAllowed(false);
      setIsFinishTimeoutAllowed(false);
      setIsTimeoutRequested(false); //TODO consider one state instead of 4
    }
    if (lastMessage.messageType == 'ISignedGameMove') {
      const signedMove = lastMessage.message as ISignedGameMove;
      console.log(`[gameType] processOneMessage signedMove: nonce: ${signedMove.gameMove.nonce}`, signedMove);
      const isOpponentMove = signedMove.gameMove.player === opponentAddress;

      let count = 0;

      const setNewGameState = async () => {
        try {
          count += 1;
          const contract = await getArbiter();
          const isValid = await _isValidSignedMove(contract, signedMove);
          const message = {
            contractAddress: contract.address,
            arguments: [
              { signedMove }
            ],
            result: { isValid }
          };
          const polygonMessage = [
            [signedMove.gameMove.gameId,
            signedMove.gameMove.nonce,
            signedMove.gameMove.player,
            signedMove.gameMove.oldState,
            signedMove.gameMove.newState,
            signedMove.gameMove.move],
            signedMove.signatures
          ];
          console.log('Requested move validation, contract message: ', JSON.stringify(polygonMessage));
          console.log(`Requested move validation, nonce: ${signedMove.gameMove.nonce}`, JSON.stringify(message, null, ' '));
          const nextGameState = gameState.makeNewGameStateFromSignedMove(
            signedMove,
            isValid,
            isOpponentMove);
          setGameState(nextGameState);
          setIsInvalidMove(!isValid);
          if (nextGameState.getWinnerId() !== null) {
            setFinishGameCheckResult({winner: playerIngameId === nextGameState.getWinnerId()})
            if (playerIngameId === nextGameState.getWinnerId()) {
              runFinishGameHandler(nextGameState);
            }
          }
          return;

        } catch (error) {
          console.error('[gameType] processOneMessage messageType: ISignedGameMove error: ', count, error);
          if (count >= 10) return;
          setTimeout(setNewGameState, 3000);
        }
      }

      try {
        setNewGameState();
      } catch (error) {
        console.error('[gameType] processOneMessage messageType: ISignedGameMove error: ', error);
      }
    }
    if (lastMessage.messageType === "FinishedGameState") {
      const {loser } = lastMessage.message as FinishedGameState;
      console.log('GOT MESSAGE');
      if (loser === account.address) { 
        setFinishGameCheckResult(null);
        setFinishedGameState(lastMessage.message as FinishedGameState);
      }
    }
  }

  useEffect(() => {
    if (!Number.isNaN(gameId)) setGameState(getInitialState());
  }, [gameId, playerIngameId]);

  useEffect(() => {
    for (let i = lastMessages.length - 1; i >= 0; i--) {
      setTimeout(function () {
        processOneMessage(i)
      }, 300 * (lastMessages.length - i - 1));
    }
  }, [lastMessages]);

  useEffect(() => {

    const isPlayerMoves = (gameType: TGameType, gameState: IGameState<any, any>, playerIngameId: 0 | 1) => {
      switch (gameType) {
        case 'checkers': 
          return playerIngameId === 0 ? !gameState.currentBoard.redMoves : gameState.currentBoard.redMoves;
        case 'tic-tac-toe':
          return playerIngameId === gameState.nonce % 2;
        default:
          throw new Error(`unknown game type: ${gameType}`);
      }
    }

    setPlayers([
      {
        playerName: playerIngameId === 0 ? 'Player1' : 'Player2',
        address: gameId && account.address ? account.address : null,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[gameType][playerIngameId],
        moves: isPlayerMoves(gameType, gameState, playerIngameId),
      },
      {
        playerName: playerIngameId === 1 ? 'Player1' : 'Player2',
        address: opponentAddress,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[gameType][playerIngameId === 0 ? 1 : 0],
        moves: !isPlayerMoves(gameType, gameState, playerIngameId),
      },
    ]);
  }, [opponentAddress, gameId, gameType, gameState]);

  useEffect(() => {
    if (gameState.lastOpponentMove?.gameMove.player === opponentAddress && isInvalidMove) {
      setIsDisputeAvailavle(true);
      return;
    }
    setIsDisputeAvailavle(false);
  }, [isInvalidMove]);

  useInterval(async () => {
    if (opponentAddress) {
      return;
    }
    if (!gameId) {
      return;
    }
    console.log('polling for opponent address, gameId=', gameId);
    let players: [string, string] = await gameApi.getPlayers(
      await getArbiter(),
      BigNumber.from(gameId),
    );
    const address = account.address;
    if (!address || !players) {
      return;
    }
    if (!(players[0] === ZERO_ADDRESS && players[1] === ZERO_ADDRESS) && !players.includes(address)) {
      throw new Error(`Player ${address} is not in game ${gameId}, players: ${players}`);
    }
    const inGameId = players.indexOf(address) == 0 ? 0 : 1;
    setPlayerIngameId(inGameId);
    let opponent = players[1 - inGameId];
    if (!opponent || opponent == ZERO_ADDRESS) {
      return;
    }
    setOpponentAddress(opponent);
  }, FETCH_OPPONENT_ADDRESS_TIMEOUT);

  if (!!gameType && !!query && query?.join === 'true') {
    return <JoinGame acceptGameHandler={acceptGameHandler} />;
  }
  if (!!gameType && !!query && query?.select === 'true') {
    return (
      <SelectGame
        userName={account.address}
        gameType={gameType}
      />
    );
  }

  if (!!gameType && !!query && query?.prize === 'true') {
    return <SelectPrize gameId={gameId?.toString()} createNewGameHandler={createNewGameHandler} />;
  }

  let gameComponent = null;
  if (gameType === 'tic-tac-toe') {
    gameComponent = <TicTacToe
      gameState={gameState as TicTacToeState}
      getSignerAddress={async () => {
        return (await getSigner()).getAddress()
      }}
      sendSignedMove={sendSignedMoveHandler}
    />
  }
  if (gameType === 'checkers') {
    gameComponent =
      <Checkers
        gameState={gameState as CheckersState}
        getSignerAddress={async () => {
          return (await getSigner()).getAddress()
        }}
        sendSignedMove={sendSignedMoveHandler}
        playerIngameId={playerIngameId}
      />
  }
  if (gameComponent) {
    if (gameType === 'checkers' || gameType === 'tic-tac-toe') {
      return (
        <div className={styles.container}>
          <div className={styles.version}>{`Ver.${version}`}</div>
          <LeftPanel
            players={players}
            isTimeoutAllowed={!isTimeoutInited}
            initTimeout={initTimeoutHandler}
            isResolveTimeoutAllowed={isResolveTimeOutAllowed}
            resolveTimeout={resolveTimeoutHandler}
            isFinishTimeOutAllowed={isFinishTimeoutAllowed}
            finishTimeout={finishTimeoutHandler}
            isTimeoutRequested={isTimeoutRequested}
            onRunDisput={runDisputeHandler}
            isDisputAvailable={isDisputAvailable}          
            gameId={gameId}
          />
          <GameField
            gameId={gameId?.toString()}
            rivalPlayerAddress={opponentAddress}
            isConnected={!!client}
            isInDispute={isInDispute}
            finishedGameState={finishedGameState}
            onConnect={setConversationHandler}
            players={players}
            finishGameCheckResult={finishGameCheckResult}
            version={version}
          >
            {gameComponent}
          </GameField>
          <RightPanel>
            <XMTPChatLog anyMessages={collectedMessages} isLoading={loading} />
          </RightPanel>
        </div>
      );
    }
  }
  return <div>No Games Available</div>;
};

export const getStaticProps: GetStaticProps<IGamePageProps, IParams> = (context) => {
  console.log('context', context.params?.gameType);
  return {
    props: {
      gameType: context.params?.gameType as TGameType,
    },
  };
};

export const getStaticPaths: GetStaticPaths<IParams> = () => {
  const gamesType = ['tic-tac-toe', 'checkers', 'other'];
  const paths = gamesType.map((gameType) => ({ params: { gameType } }));
  return {
    paths,
    fallback: false,
  };
};

export default Game;
