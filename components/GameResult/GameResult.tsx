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

