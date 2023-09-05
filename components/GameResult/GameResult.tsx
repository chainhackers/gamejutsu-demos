'use client';
import React from 'react';
import classNames from 'classnames';
import styles from './GameResult.module.scss';
import imgWin from 'public/images/win.png';
import loseImg from 'public/images/lose.svg';
import drawImg from 'public/images/draw.svg';
import team from 'data/team.json';
import { BlockPayedGame, CustomButton } from 'components/shared';
import { TeamMemberBasic } from 'components/shared/ui/TeamMemberBasic';
import { useGameStateContext } from '../../contexts/GameStateContext';
import { Player } from '../Player';
import { PlayerI } from '../../types/game';
import { Players } from '../Players';
import { ScoreCard } from './ScoreCard';

export const GameResult = () => {
  const { finishResult, setFinishResult, playerResult, setPlayerResult } = useGameStateContext();

  console.log('GAMERESULT log finishResult: ', finishResult);
  let winner,
    isDraw,
    cheatWin = false;
  if (finishResult !== null) {
    winner = finishResult.winner;
    isDraw = finishResult.isDraw;
    cheatWin = finishResult.cheatWin;
  }

  console.log('Данные из finishResult в GameResult: ', finishResult);
  console.log('Данные из winner: ', winner);
  // if (playerResult !== null) {
  //   const players = playerResult
  // }

  // const players = playerResult as unknown as PlayerI[];
  //
  // const player1 = players[0]
  // const player2 = players[1]

  // const player1 = playerResult?.players ? players : [0];
  // const player2 = playerResult?.players ? players : [1];
  console.log('Данные из playerResult в GameResult', playerResult);

  return (
    <div
      className={classNames(styles.container, {
        [styles.win]: winner,
        [styles.lose]: !winner,
        [styles.draw]: isDraw,
      })}>
      <h2 className={styles.title}>
        {winner === true && <span>Winner!</span>}
        {!winner && <span>Better Luck Next Time</span>}
        {isDraw === true && <span>Better Luck Next Time</span>}
      </h2>
      {winner && (
        <img src={imgWin.src} alt='Win' width={640} height={510} className={styles.imageWin} />
      )}
      {winner === false && (
        <h1 className={styles.titleResult}>
          You lose <img src={loseImg.src} alt='lose' className={styles.imageSize} />
        </h1>
      )}
      {isDraw === true && (
        <h1 className={styles.titleResult}>
          Draw <img src={drawImg.src} alt='draw' className={styles.imageSize} />
        </h1>
      )}
      <div className={styles.containerCard}>
        {/*<Players player1={players[0]} player2={players[1]} {...props}/>*/}
        {/*<Player {...player2} />*/}
        {/*<Player {...player1} />*/}
        {/*<Players player1={players ? players : [0]} player2={players ? players : [1]} {...props} />*/}
        {playerResult.length === 2 && (
          <>
            <ScoreCard finishResult={finishResult} playerResult={playerResult[0]} />
            <ScoreCard finishResult={finishResult} playerResult={playerResult[1]} />
          </>
        )}
      
      </div>
      <BlockPayedGame />
      <h2 className={styles.titleCenter}>Read more about our technology</h2>
      <div className={styles.containerBtn}>
        <CustomButton
          size='sm'
          color='gradient'
          radius='lg'
          text='Github'
          imagePosition='right'
          image='/images/git.svg'
          link='https://github.com/chainhackers'
        />
        <CustomButton
          size='sm'
          color='gradient'
          radius='lg'
          text='Publications'
          imagePosition='right'
          image='/images/publ.svg'
        />
      </div>
      <h2 className={styles.titleCenterBottom}>
        The dream team for your future
        <br /> games is here!
      </h2>
      <div className={styles.teamMemberWrapper}>
        <div className={styles.teamMemberContainer}>
          {team &&
            team.map((teamMember) => (
              <TeamMemberBasic
                key={teamMember.name}
                image={teamMember.image}
                name={teamMember.name}
                role={teamMember.role}
              />
            ))}
        </div>
      </div>
      <div className={styles.containerBtnColumn}>
        <CustomButton size='lg' color='gradient' radius='lg' text='Tell us about your idea' />
        <CustomButton
          size='lg'
          color='transparent'
          radius='sm'
          text='Restart Demo'
          imagePosition='left'
          image='/images/dice.svg'
        />
      </div>
    </div>
  );
};

// const player1 = {
//   playerName: '0xh20...7260',
//   playerImg: playerImg,
//   showWinText: setFinishResult?.winner === true,
//   gameType: 'tic-tac-toe',
//   icon: gameType === 'tic-tac-toe' ? <XIcon /> : <PurpleIcon />,
// };
// const player2 = {
//   playerName: '0xh07...6035',
//   playerImg: playerImg2,
//   showWinText: setFinishResult?.winner === false,
//   gameType: 'tic-tac-toe',
//   icon: gameType ===  'tic-tac-toe' ? <OIcon /> : <WhiteIcon />,
// };
