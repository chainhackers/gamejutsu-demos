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
import { ETTicTacToe, PlayerType as TicTacToePlayerType } from "components/Games/ET-Tic-Tac-Toe";
import { TicTacToeState } from "components/Games/ET-Tic-Tac-Toe/types";
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
  gameType: TGameType
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}
const PROPOSER_INGAME_ID = 0;
const ACCEPTER_INGAME_ID = 1;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const FETCH_OPPONENT_ADDRESS_TIMEOUT = 2500;

const Game: NextPage<IGamePageProps> = ({ gameType }) => {

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
    initClient(getSigner())
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

    let address = await getSigner().getAddress();
    const signature = await signMoveWithAddress(nextGameState.lastOpponentMove.gameMove, address);
    const signatures = [...nextGameState.lastOpponentMove.signatures, signature];
    let lastOpponentMoveSignedByAll = new SignedGameMove(
      nextGameState.lastOpponentMove.gameMove,
      signatures,
    );

    const finishedGameResult = await finishGame(getArbiter(), [
      lastOpponentMoveSignedByAll,
      nextGameState.lastMove,
    ]);
    sendMessage({
      gameId: gameId,
      message: finishedGameResult,
      messageType: 'FinishedGameState',
      gameType
    })
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
      let address = await getSigner().getAddress();
      const signature = await signMoveWithAddress(gameState.lastOpponentMove.gameMove, address);
      const signatures = [...gameState.lastOpponentMove.signatures, signature];
      let lastOpponentMoveSignedByAll = new SignedGameMove(
        gameState.lastOpponentMove.gameMove,
        signatures,
      );
      console.log('lastOpponentMoveSignedByAll', lastOpponentMoveSignedByAll);

      const initTimeoutResult = await initTimeout(getArbiter(), [
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
    const resolveTimeoutResult = await resolveTimeout(getArbiter(), gameState.lastMove);
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
      getArbiter(),
      getRulesContract(gameType).address,
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
      getArbiter(),
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
      const finishedGameResult = await finalizeTimeout(getArbiter(), BigNumber.from(gameId));
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

    const finishedGameResult = await disputeMove(getArbiter(), gameState.lastOpponentMove);
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

      const isValid = await _isValidSignedMove(getArbiter(), signedMove);

      //TODO maybe replace with sender address
      const isOpponentMove = signedMove.gameMove.player === opponentAddress;
      const nextGameState = gameState.makeNewGameStateFromSignedMove(
        signedMove,
        isValid,
        isOpponentMove);
      setGameState(nextGameState);
      setIsInvalidMove(!isValid);
      if (nextGameState.getWinnerId() !== null) {
        if (playerIngameId === nextGameState.getWinnerId()) {
          runFinishGameHandler(nextGameState);
        }
      }
    }
  }

  useEffect(() => {
    if (Number.isNaN(gameId)) setGameState(getInitialState());
  }, [gameId]);

  useEffect(() => {
    for (let i = lastMessages.length - 1; i >= 0; i--) {
      setTimeout(function () {
        processOneMessage(i)
      }, 100 * (lastMessages.length - i - 1));
    }
  }, [lastMessages]);

  useEffect(() => {

    const isPlayerMoves = (gameType: TGameType, gameState: IGameState<any, any>, playerIngameId: 0 | 1) => {
      switch (gameType) {
        case 'checkers': 
          return playerIngameId === 0 ? !gameState.currentBoard.redMoves : gameState.currentBoard.redMoves;
        case 'tic-tac-toe':
          return false;
        default:
          throw new Error('unknown game type');
      }
    }

    console.log('ISMOVE', isPlayerMoves(gameType, gameState, playerIngameId))
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
      getArbiter(),
      BigNumber.from(gameId),
    );
    const address = account.address;
    if (!address) {
      return;
    }
    if (!players.includes(address)) {
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
    console.log('prize', query?.prize, query?.gameId);
    return <SelectPrize gameId={gameId?.toString()} createNewGameHandler={createNewGameHandler} />;
  }

  let gameComponent = null;
  if (gameType === 'tic-tac-toe') {
    gameComponent = <ETTicTacToe
      gameState={gameState as TicTacToeState}
      getSignerAddress={() => {
        return getSigner().getAddress()
      }}
      sendSignedMove={sendSignedMoveHandler}
    />
  }
  if (gameType === 'checkers') {
    gameComponent =
      <Checkers
        gameState={gameState as CheckersState}
        getSignerAddress={() => {
          return getSigner().getAddress()
        }}
        sendSignedMove={sendSignedMoveHandler}
        playerIngameId={playerIngameId}
      />
  }
  if (gameComponent) {
    if (gameType === 'checkers' || gameType === 'tic-tac-toe') {
      return (
        <div className={styles.container}>
          <LeftPanel
            players={players}
            isTimeoutAllowed={!isTimeoutInited}
            initTimeout={initTimeoutHandler}
            isResolveTimeoutAllowed={isResolveTimeOutAllowed}
            resolveTimeout={resolveTimeoutHandler}
            isFinishTimeOutAllowed={isFinishTimeoutAllowed}
            finishTimeout={finishTimeoutHandler}
            isTimeoutRequested={isTimeoutRequested}
            // isTimeoutRequested={true}
            onRunDisput={runDisputeHandler}
            isDisputAvailable={isDisputAvailable}
          // connectPlayer={connectPlayerHandler}
          />
          <GameField
            gameId={gameId?.toString()}
            rivalPlayerAddress={opponentAddress}
            isConnected={!!client}
            isInDispute={isInDispute}
            finishedGameState={finishedGameState}
            onConnect={setConversationHandler}
            players={players}
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
