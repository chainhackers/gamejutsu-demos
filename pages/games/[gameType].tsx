import { useEffect, useState, useRef } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { XMTPChatLog } from 'components/XMTPChatLog';
import { useWalletContext } from 'contexts/WalltetContext';
import { ControlPanel, useInterval } from 'components/ControlPanel';
import {
  GameField,
  JoinGame,
  LeftPanel,
  RightPanel,
  SelectGame,
  SelectPrize,
} from 'components';

import styles from 'pages/games/gameType.module.scss';
import { ETTicTacToe } from "components/Games/ET-Tic-Tac-Toe";
import { TicTacToeState } from "components/Games/ET-Tic-Tac-Toe/types";
import { PlayerI } from "../../types";
import gameApi, { _isValidSignedMove, getArbiter, getSigner, getRulesContract, finishGame, disputeMove, initTimeout, resolveTimeout, finalizeTimeout, FinishedGameState } from "../../gameApi";
import { ISignedGameMove, SignedGameMove } from "../../types/arbiter";
import { signMoveWithAddress } from 'helpers/session_signatures';
import { useAccount } from 'wagmi';
import { Checkers } from 'components/Games/Checkers';
import { CheckersState } from 'components/Games/Checkers/types';
import { useRouter } from 'next/router';
import { IGameState, TPlayer } from 'components/Games/types';
import useConversation, {TGameType} from 'hooks/useConversation';
import {GameProposedEvent, GameProposedEventObject} from "../../.generated/contracts/esm/types/polygon/Arbiter";

interface IGamePageProps {
  gameType: TGameType
}

interface IParams extends ParsedUrlQuery {
  gameType: string;
}
const PROPOSER_INGAME_ID = 0;
const ACCEPTER_INGAME_ID = 1;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const FETCH_RIVAL_ADDRESS_TIMEOUT = 2500;

const Game: NextPage<IGamePageProps> = ({ gameType }) => {

  const initialTicTacToeState = new TicTacToeState({ gameId: 1, playerType: 'X' });

  const getInitialState = (gameId: number, playerType: TPlayer) => {
    let initialCheckersState = new CheckersState({ gameId, playerType });
    return initialCheckersState;
  }

  const [playerIngameId, setPlayerIngameId] = useState<0 | 1>(0); //TODO use in game state creation
  const [isInDispute, setIsInDispute] = useState<boolean>(false);
  const [lastMove, setLastMove] = useState<ISignedGameMove | null>(null);
  const [lastOpponentMove, setLastOpponentMove] = useState<ISignedGameMove | null>(null);
  const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  const [isDisputAvailable, setIsDisputeAvailavle] = useState<boolean>(false);

  const [opponentPlayerAddress, setOpponentPlayerAddress] = useState<string | null>(null,);


  const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerI[]>([]);


  const [isTimeoutInited, setIsTimeoutInited] = useState<boolean>(false);
  const [isResolveTimeOutAllowed, setIsResolveTimeOutAllowed] = useState<boolean>(false);
  const [isFinishTimeoutAllowed, setIsFinishTimeoutAllowed] = useState<boolean>(false);
  const [isTimeoutRequested, setIsTimeoutRequested] = useState<boolean>(false);


  const { signer } = useWalletContext();
  const { query } = useRouter();
  const account = useAccount();

  const playersTypesMap = { 0: 'X', 1: 'O' };


  let gameState: IGameState<any, any>;
  let setGameState: ((arg0: any) => void);
  if (gameType == 'tic-tac-toe') {
    [gameState, setGameState] = useState<IGameState<any, any>>(initialTicTacToeState);
  } else {
    [gameState, setGameState] = useState<IGameState<any, any>>(getInitialState(1, 'X'));
  }

  const { sendMessage, loading, collectedOtherMessages, collectedSignedGameMoves, lastChunkKnownGameMessages} = useConversation(
    opponentPlayerAddress!,
    Number(gameId!),
    false,
    true
  )

  const setConversationHandler = async (rivalPlayerAddress: string) => {
    if (!rivalPlayerAddress) {
      console.error('cant connect: no rival player address');
      return;
    }
    setOpponentPlayerAddress(rivalPlayerAddress);

    if (gameType == 'tic-tac-toe') {
      setGameState(new TicTacToeState({ gameId: Number(gameId!), playerType: playerIngameId === 0 ? 'X' : 'O' }));
    } else {
      setGameState(getInitialState(Number(gameId), playerIngameId === 0 ? 'X' : 'O'));
    }
  };

  const sendSignedMoveHandler = async (signedMove: ISignedGameMove) => {

    _isValidSignedMove(getArbiter(), signedMove).then((isValid) => {
      const nextGameState = gameState.makeNewGameStateFromSignedMove(signedMove, isValid);
      sendMessage({
        message: signedMove,
        messageType: 'ISignedGameMove',
        gameType
      }).then(() => {
        setLastMove(signedMove);
        setGameState(nextGameState);
        console.log('nextGameState is set after sending the move', nextGameState);

        if (nextGameState.getWinnerId() !== null) {
          if (playerIngameId === nextGameState.getWinnerId()) {
            runFinishGameHandler(signedMove);
          }
        }
      });
    });
  };

  const runFinishGameHandler = async (_lastMove: ISignedGameMove | null) => {
    if (!lastOpponentMove) {
      throw 'no lastOpponentMove';
    }
    if (!_lastMove) {
      throw 'no lastMove'
    }

    let address = await getSigner().getAddress();
    const signature = await signMoveWithAddress(lastOpponentMove.gameMove, address);
    const signatures = [...lastOpponentMove.signatures, signature];
    let lastOpponentMoveSignedByAll = new SignedGameMove(
      lastOpponentMove.gameMove,
      signatures,
    );

    const finishedGameResult = await finishGame(getArbiter(), [
      lastOpponentMoveSignedByAll,
      _lastMove,
    ]);
    sendMessage({
      message: finishedGameResult,
      messageType: 'FinishedGameState',
      gameType
    })
    setFinishedGameState(finishedGameResult);
  };

    const initTimeoutHandler = async () => {
        console.log('initTimeout Handler');
        if (!lastOpponentMove) {
            console.log('no lastOpponentMove');
            return;
        }
        if (!lastMove) {
            console.log('no lastMove');
            return;
        }
        setIsTimeoutInited(true);
        setIsFinishTimeoutAllowed(true);
        setIsResolveTimeOutAllowed(false);
        try {
            let address = await getSigner().getAddress();
            const signature = await signMoveWithAddress(lastOpponentMove.gameMove, address);
            const signatures = [...lastOpponentMove.signatures, signature];
            let lastOpponentMoveSignedByAll = new SignedGameMove(
                lastOpponentMove.gameMove,
                signatures,
            );
            console.log('lastOpponentMoveSignedByAll', lastOpponentMoveSignedByAll);

            const initTimeoutResult = await initTimeout(getArbiter(), [
                lastOpponentMoveSignedByAll,
                lastMove,
            ]);

            sendMessage({
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
        if (!lastMove) {
            throw Error('no lastMove');
        }
        const resolveTimeoutResult = await resolveTimeout(getArbiter(), lastMove);
        console.log('resolveTimeoutResult', resolveTimeoutResult);
        sendMessage({
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
          message: proposeGameResult,
          messageType: 'GameProposedEvent',
          gameType
      })

    setGameId(proposeGameResult.gameId.toString());
    setPlayerIngameId(PROPOSER_INGAME_ID);
  }

  const acceptGameHandler = async (gameId: string, stake: string): Promise<void> => {
    if (!account) throw new Error(`No wallet`);
    if (!gameId || gameId.length === 0) throw new Error(`Empty game id`);
    const acceptGameResult = await gameApi.acceptGame(
        getArbiter(),
        gameId,
        stake,
    );

    sendMessage({
      message: acceptGameResult,
      messageType: 'GameStartedEvent',
      gameType
    })

    let rivalPlayer = acceptGameResult.players[PROPOSER_INGAME_ID];
    setOpponentPlayerAddress(rivalPlayer);
    setPlayerIngameId(ACCEPTER_INGAME_ID);
    setGameId(gameId);
  };

  const finishTimeoutHandler = async () => {
    if (!gameId) {
      throw ('no gameId');
    }
    try {
      const finishedGameResult = await finalizeTimeout(getArbiter(), parseInt(gameId));
      sendMessage({
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
    setIsInDispute(true);
    if (lastOpponentMove) {
      const finishedGameResult = await disputeMove(getArbiter(), lastOpponentMove);
      sendMessage({
        message: finishedGameResult,
        messageType: 'FinishedGameState',
        gameType
      })
      setFinishedGameState(finishedGameResult);
    }
    setIsInDispute(false);
  };

  useEffect(() => {
    for (let i = collectedSignedGameMoves.length - 1; i >= 0; i--) {
      const signedMove = collectedSignedGameMoves[i];
      //TODO maybe replace with sender address
      if (signedMove.gameMove.player === opponentPlayerAddress) {
        _isValidSignedMove(getArbiter(), signedMove).then((isValid) => {
          const nextGameState = gameState.makeNewGameStateFromOpponentSignedMove(signedMove, isValid);
          setLastOpponentMove(signedMove);
          setGameState(nextGameState);
          console.log('nextGameState + winner', nextGameState);
          setIsInvalidMove(!isValid);
        });
      }
    };
  }, [collectedSignedGameMoves]);

  useEffect(() => {
    let lastMessage = collectedOtherMessages[0];
    if (!lastMessage) {
      return;
    }
    }, [collectedOtherMessages]);

  useEffect(() => {
    for (let i = lastChunkKnownGameMessages.length - 1; i >= 0; i--) {
      const knownGameMessage = lastChunkKnownGameMessages[i];
      if (knownGameMessage.messageType === 'TimeoutStartedEvent') {
        setIsTimeoutInited(true);
        setIsResolveTimeOutAllowed(true);
        setIsFinishTimeoutAllowed(true);
        setIsTimeoutRequested(true);
      } else if (knownGameMessage.messageType === 'TimeoutResolvedEvent') {
        setIsTimeoutInited(false);
        setIsResolveTimeOutAllowed(false);
        setIsFinishTimeoutAllowed(false);
        setIsTimeoutRequested(false); //TODO consider one state instead of 4
      }
    }
  }, [lastChunkKnownGameMessages]);

  useEffect(() => {
    setPlayers([
      {
        playerName: playerIngameId === 0 ? 'Player1' : 'Player2',
        address: gameId && account.address ? account.address : null,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[playerIngameId],
      },
      {
        playerName: playerIngameId === 1 ? 'Player1' : 'Player2',
        address: opponentPlayerAddress,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[playerIngameId === 0 ? 1 : 0],
      },
    ]);
  }, [opponentPlayerAddress, gameId]);

  useEffect(() => {
    if (lastOpponentMove?.gameMove.player === opponentPlayerAddress && isInvalidMove) {
      setIsDisputeAvailavle(true);
      return;
    }
    setIsDisputeAvailavle(false);
  }, [isInvalidMove]);

  useInterval(async () => {
    if (opponentPlayerAddress) {
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
    let rivalPlayer = players[playerIngameId == 0 ? 1 : 0];
    if (rivalPlayer == ZERO_ADDRESS) {
      return;
    }
    if (rivalPlayer) {
      setOpponentPlayerAddress(rivalPlayer);
    } else {
      setOpponentPlayerAddress(null);
    }
  }, FETCH_RIVAL_ADDRESS_TIMEOUT);

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
    return <SelectPrize gameId={gameId} createNewGameHandler={createNewGameHandler} />;
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
    gameComponent = <div className={styles.container}>
      <ControlPanel
        gameId={gameId}
        gameType={gameType}
        playersTypes={{ 0: 'X', 1: 'O' }}
        onConnectPlayer={setConversationHandler}
        onSetPlayerIngameId={setPlayerIngameId}
        finishedGameState={finishedGameState}
        rivalPlayerConversationStatus={"todo: always connected string"}
        onProposeGame={setGameId}
        onAcceptGame={setGameId}
        isInvalidMove={isInvalidMove}
        isInDispute={isInDispute}
        onFinishGame={() => runFinishGameHandler(lastMove)}
        onDispute={runDisputeHandler}
        onInitTimeout={initTimeoutHandler}
        onResolveTimeout={resolveTimeoutHandler}
        onFinalizeTimeout={initTimeoutHandler}
      />
      <Checkers
        gameState={gameState as CheckersState}
        getSignerAddress={() => {
          return getSigner().getAddress()
        }}
        sendSignedMove={sendSignedMoveHandler}
      />
    </div>
  }
  if (gameComponent) {
    if (gameType === 'checkers') {
      return (
        <div className={styles.container}>
          {gameComponent}

          <RightPanel>
            <XMTPChatLog
              logData={[]}
              isLoading={loading} />
          </RightPanel>
        </div>
      );
    } else if (gameType === 'tic-tac-toe') {
      return (
        <div className={styles.container}>
          <LeftPanel
            players={players}
            isTimeoutAllowed={!!lastOpponentMove && !!lastMove && !isTimeoutInited}
            // isTimeoutAllowed={!isTimeoutInited}
            initTimeout={initTimeoutHandler}
            isResolveTimeoutAllowed={!!lastMove && isResolveTimeOutAllowed}
            // isResolveTimeoutAllowed={isResolveTimeOutAllowed}
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
            gameId={gameId}
            rivalPlayerAddress={opponentPlayerAddress}
            isConnected={loading}
            isInDispute={isInDispute}
            finishedGameState={finishedGameState}
            onConnect={setConversationHandler}
          >
            {gameComponent}
          </GameField>
          <RightPanel>
            <XMTPChatLog logData={[]} isLoading={loading} />
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
