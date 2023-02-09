import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { ParsedUrlQuery } from 'querystring';
import { XMTPChatLog } from 'components/XMTPChatLog';
import {
  Disclaimer,
  DisclaimerNotice,
  GameField,
  GetHistory,
  JoinGame,
  LeftPanel,
  RightPanel,
  SelectGame,
  SelectPrize,
} from 'components';

import styles from 'pages/games/gameType.module.scss';
import { TicTacToe, PlayerType as TicTacToePlayerType } from "components/Games/Tic-Tac-Toe";
import { TicTacToeState } from "components/Games/Tic-Tac-Toe/types";
import gameApi, { isValidSignedMove, getArbiter, getSigner, getRulesContract, finishGame, disputeMove, initTimeout, resolveTimeout, finalizeTimeout, FinishedGameState, RunDisputeState, getArbiterRead, isValidGameMove } from "../../gameApi";
import { ISignedGameMove, SignedGameMove } from "../../types/arbiter";
import { signMoveWithAddress } from 'helpers/session_signatures';
import { useAccount } from 'wagmi';
import { Checkers, PlayerType as CheckersPlayerType } from 'components/Games/Checkers';
import { CheckersState } from 'components/Games/Checkers/types';
import { IGameState, TPlayer } from 'components/Games/types';
import { GameProposedEvent, GameProposedEventObject } from "../../.generated/contracts/esm/types/polygon/Arbiter";
import { BigNumber } from 'ethers';
import { useInterval } from 'hooks/useInterval';
import useConversation, { IAnyMessage } from "../../hooks/useConversation";
import { PlayerI, TGameType } from 'types/game';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';


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
  const [disputeRunner, setDisputeRunner] = useState<string | null>(null);
  const [finishedGameState, setFinishedGameState] = useState<FinishedGameState | null>(null);

  const [isDisputAvailable, setIsDisputeAvailavle] = useState<boolean>(false);

  const [opponentAddress, setOpponentAddress] = useState<string | null>(null,);


  const [isInvalidMove, setIsInvalidMove] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerI[]>([]);


  const [isTimeoutInited, setIsTimeoutInited] = useState<boolean>(false);
  const [isResolveTimeOutAllowed, setIsResolveTimeOutAllowed] = useState<boolean>(false);
  const [isFinishTimeoutAllowed, setIsFinishTimeoutAllowed] = useState<boolean>(false);
  const [isTimeoutRequested, setIsTimeoutRequested] = useState<boolean>(false);

  const [finishGameCheckResult, setFinishGameCheckResult] = useState<null | { winner: boolean , isDraw: boolean} >(null);
  const [nextGameState, setNextGameState] = useState<IGameState<any, any> | null>(null);

  const [messageHistory, setMessageHistory] = useState<{[id: string]: any}[]>([])

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

  const { t } = useTranslation();

  const gameId = parseInt(query.game as string);

  const getInitialState = () => {
    const playerType: TPlayer = playerIngameId === 0 ? 'X' : 'O'
    if (gameType == 'tic-tac-toe') {
      return new TicTacToeState({ gameId, playerType })
    }
    return new CheckersState({ gameId, playerType })
  }

  const [gameState, setGameState] = useState<IGameState<any, any>>(getInitialState());

  const {
    loading,
    collectedMessages,
    sendMessage,
    lastMessages,
    initClient,
    client,
    disconnect } = useConversation(
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
    await sendMessage({
      gameId: gameId,
      message: signedMove,
      messageType: 'ISignedGameMove',
      gameType
    })
  };

  const runFinishGameHandler = async () => {
    if (!nextGameState) {
      throw 'no nextGameState';
    }
    if (!nextGameState.lastOpponentMove) {
      throw 'no lastOpponentMove';
    }
    if (!nextGameState.lastMove) {
      throw 'no lastMove'
    }

    const address = await (await getSigner()).getAddress();
    const signature = await signMoveWithAddress(nextGameState.lastOpponentMove.gameMove, address);
    const signatures = [...nextGameState.lastOpponentMove.signatures, signature];
    const lastOpponentMoveSignedByAll = new SignedGameMove(
      nextGameState.lastOpponentMove.gameMove,
      signatures,
    );

    const finishedGameResult = await finishGame(await getArbiter(), [
      lastOpponentMoveSignedByAll,
      nextGameState.lastMove,
    ]);
    await sendMessage({
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
      const address = await (await getSigner()).getAddress();
      const signature = await signMoveWithAddress(gameState.lastOpponentMove.gameMove, address);
      const signatures = [...gameState.lastOpponentMove.signatures, signature];
      const lastOpponentMoveSignedByAll = new SignedGameMove(
        gameState.lastOpponentMove.gameMove,
        signatures,
      );
      console.log('lastOpponentMoveSignedByAll', lastOpponentMoveSignedByAll);

      const initTimeoutResult = await initTimeout(await getArbiter(), [
        lastOpponentMoveSignedByAll,
        gameState.lastMove,
      ]);

      await sendMessage({
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
    await sendMessage({
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

    await sendMessage({
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

    await sendMessage({
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
      await sendMessage({
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

    setDisputeRunner(account.address!)

    await sendMessage({
      gameId: gameId,
      messageType: 'RunDisputeState',
      gameType,
      message: { gameId, disputeRunner: account.address! }
    })

    const finishedGameResult = await disputeMove(await getArbiter(), gameState.lastOpponentMove);
    console.log('finishedGameResult dispute move', finishedGameResult)
    await sendMessage({
      gameId: gameId,
      message: finishedGameResult,
      messageType: 'FinishedGameState',
      gameType
    })

    setFinishedGameState(finishedGameResult);
    setIsInDispute(false);
  };


  async function processOneMessage(i: number) {//TODO
    console.log(lastMessages);
    
    const lastMessage = lastMessages[i];
    console.log(lastMessage);
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
    if (lastMessage.messageType === 'ISignedGameMove') {
      console.log('ISignedGameMove ISignedGameMove', lastMessage);


      const signedMove = lastMessage.message as ISignedGameMove;
      console.log(`[gameType] processOneMessage signedMove: nonce: ${signedMove.gameMove.nonce}`, signedMove);
      const isOpponentMove = signedMove.gameMove.player === opponentAddress;

      let count = 0;

      const setNewGameState = async () => {
        try {
          count += 1;
          const contract = await getArbiterRead();          
          const frontIsValidMove = true; //TODO: set up checking move validity on front
          const isValidMove = await isValidGameMove(contract, signedMove.gameMove);
          const isValid = await isValidSignedMove(contract, signedMove);
          
          const message = {
            contractAddress: contract.address,
            arguments: [
              { signedMove }
            ],
            validity: { isValidFront: frontIsValidMove, isValidMove, isValidSignedMove: isValid }
          };
          const polygonMessageGameMove = [signedMove.gameMove.gameId,
          signedMove.gameMove.nonce,
          signedMove.gameMove.player,
          signedMove.gameMove.oldState,
          signedMove.gameMove.newState,
          signedMove.gameMove.move];
          const polygonMessageSignedMove = [
            polygonMessageGameMove,
            signedMove.signatures
          ];
          console.log('Requested move validation, contract message: ', JSON.stringify(polygonMessageSignedMove));
          console.log(`Requested move validation, nonce: ${signedMove.gameMove.nonce}\n`, JSON.stringify(message, null, ' '));
          
          // START ***** DEBUG AND DEMO PURPOSE ONLY. TODO: DON'T DO THIS IN NON-DEMO APPS ******
          const storedSignatures = localStorage.getItem('signatures');
          const parsedStoredSignatures = !storedSignatures ? null : JSON.parse(storedSignatures);
          const signatureInfo = !parsedStoredSignatures ? null : parsedStoredSignatures[signedMove.signatures[0]];
          console.log('Requested move validation, signature data:', !parsedStoredSignatures ? 'not available' : signatureInfo)
          // END ******* DEBUG AND DEMO PURPOSE ONLY. TODO: DON'T DO THIS IN NON-DEMO APPS ******

          setMessageHistory((prev) => [
            ...prev,
            {
              nonce: String(signedMove.gameMove.nonce),
              message,
              // START ***** DEBUG AND DEMO PURPOSE ONLY. TODO: DON'T DO THIS IN NON-DEMO APPS ******
              signatureInfo: !signatureInfo ? 'not available' : signatureInfo,
              // END ******* DEBUG AND DEMO PURPOSE ONLY. TODO: DON'T DO THIS IN NON-DEMO APPS ******
              polygonMessageGameMove: JSON.stringify(polygonMessageGameMove),
              polygonMessageSignedMove: JSON.stringify(polygonMessageSignedMove),
            }])

          if (isValidMove !== isValid) {
            throw new Error(`isValidGameMove: ${isValidMove} is not equal to isValidSignedMove: ${isValid}`);
          }

          const previouseMove = i + 1 === lastMessages.length ? null : lastMessages[i + 1].message as ISignedGameMove;
          const nextGameState = gameState.makeNewGameStateFromSignedMove(
            signedMove,
            isValid,
            isOpponentMove,
            previouseMove,
            );
          
          setGameState(nextGameState);
          setIsInvalidMove(!isValid);
          const winnerId = nextGameState.getWinnerId();
          if (winnerId !== null) {
            setFinishGameCheckResult({ winner: playerIngameId === winnerId, isDraw: false });
            setNextGameState(nextGameState);
          } else if (gameType === 'tic-tac-toe' && signedMove.gameMove.nonce  === 8) {
            setFinishGameCheckResult({ winner: false, isDraw: true });
            setNextGameState(nextGameState);
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
    if (lastMessage.messageType === 'RunDisputeState') {
      const { disputeRunner } = lastMessage.message as RunDisputeState;
      if (disputeRunner !== account.address) setDisputeRunner(disputeRunner);
      setIsInDispute(true);
    }
    if (lastMessage.messageType === "FinishedGameState") {
      console.log('last message proceess one message', lastMessage)
      const { loser } = lastMessage.message as FinishedGameState;
      console.log('GOT MESSAGE');
      if (loser === account.address) { 
        setFinishGameCheckResult(null);
        setFinishedGameState(lastMessage.message as FinishedGameState);
      }
    }
  }

  useEffect(() => {
    if (!Number.isNaN(gameId)) setGameState(getInitialState());
    return () => disconnect();
  }, [gameId, playerIngameId]);

  useEffect(() => {
    const runLastMessages = async (messages: IAnyMessage[]) => {
      if (messages.length === 0) return;
      await processOneMessage(messages.length - 1);
      setTimeout(() => runLastMessages(messages.slice(0, messages.length - 1)), 500);
    }
    runLastMessages(lastMessages);
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
        moves: !finishedGameState && !isInDispute && isPlayerMoves(gameType, gameState, playerIngameId),
      },
      {
        playerName: playerIngameId === 1 ? 'Player1' : 'Player2',
        address: opponentAddress,
        avatarUrl: '/images/empty_avatar.png',
        playerType: playersTypesMap[gameType][playerIngameId === 0 ? 1 : 0],
        moves: !finishedGameState && !isInDispute && !isPlayerMoves(gameType, gameState, playerIngameId),
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
      await getArbiterRead(),
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
  if (gameComponent && gameId) {
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
          {gameType === 'checkers' && <Link href="#disclaimer"><div className={styles.disclaimerLink}><DisclaimerNotice><strong>{t('games.checkers.disclaimer.notice')}
          </strong></DisclaimerNotice></div></Link>}
        
          <GameField
            gameId={gameId?.toString()}
            rivalPlayerAddress={opponentAddress}
            isConnected={!!client}
            isInDispute={isInDispute}
            disputeMode={{isInDispute, disputeRunner}}
            finishedGameState={finishedGameState}
            onConnect={setConversationHandler}
            players={players}
            finishGameCheckResult={finishGameCheckResult}
            version={version}
            onClaimWin={runFinishGameHandler}
          >
            {gameComponent}
          </GameField>
          <RightPanel>
          <div style={{ position: 'absolute', right: '0'}}>
              <GetHistory history={lastMessages} messageHistory={messageHistory} gameId={gameId}/>
            </div>
            <XMTPChatLog anyMessages={collectedMessages} isLoading={loading} />
          </RightPanel>
          {gameType === 'checkers' && <Disclaimer>{t('games.checkers.disclaimer.s1')} <strong>
            <Link href='https://www.officialgamerules.org/checkers' target={'_blank'}>{t('games.checkers.disclaimer.l1')}</Link>
            </strong> {t('games.checkers.disclaimer.s2')}</Disclaimer>}
        </div>
      );
    }
  }
  return <div>Loading...</div>;
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
