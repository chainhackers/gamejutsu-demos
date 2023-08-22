'use client';
import classNames from 'classnames';
import styles from './GameResult.module.scss';
import imgWin from 'public/images/win.png';
import playerImg from 'public/logo/account-avatar.png';
import playerImg2 from 'public/logo/account-avatar2.png';
import loseImg from 'public/images/lose.svg';
import drawImg from 'public/images/draw.svg';
import team from 'data/team.json';
import { IGameResultProps } from './GameResultProps';
import { BlockPayedGame, CustomButton, PurpleIcon, WhiteIcon } from 'components/shared';
import { ScoreCard } from 'components/GameResult/ScoreCard/index';
import { TeamMemberBasic } from 'components/shared/ui/TeamMemberBasic';
import { OIcon, XIcon } from 'components/shared/ui/XOIcons';
import { useEffect, useState } from 'react';
import { FinishedGameState } from 'gameApi';
import {IGameStateContext, useGameStateContext} from "../../contexts/GameStateContext";
export const GameResult= () => {
  const gameStateContext: IGameStateContext = useGameStateContext();
  const {finishResult, setFinishResult } = gameStateContext
  console.log('COMPONENT GameResult', gameStateContext);

  // const player1 = {
  //   playerName: '0xh20...7260',
  //   playerImg: playerImg,
  //   showWinText: finishResult?.winner === true,
  //   gameType: 'tic-tac-toe',
  //   icon: gameType === 'tic-tac-toe' ? <XIcon /> : <PurpleIcon />,
  // };
  // const player2 = {
  //   playerName: '0xh07...6035',
  //   playerImg: playerImg2,
  //   showWinText: finishResult?.winner === false,
  //   gameType: 'tic-tac-toe',
  //   icon: gameType ===  'tic-tac-toe' ? <OIcon /> : <WhiteIcon />,
  // };

  return (
    <div
      className={classNames(styles.container, {
        [styles.win]: finishResult?.winner === true,
        [styles.lose]: finishResult?.winner === false,
        [styles.draw]: finishResult?.isDraw === true,
      })}>
      <h2 className={styles.title}>
        {finishResult?.winner === true && <span>Winner!</span>}
        {finishResult?.winner === false && <span>Better Luck Next Time</span>}
        {finishResult?.isDraw === true && <span>Better Luck Next Time</span>}
      </h2>
      {finishResult?.winner && <img src={imgWin.src} alt='Win' width={640} height={510} className={styles.imageWin} />}
      {finishResult?.winner === false && (
        <h1 className={styles.titleResult}>
          You lose <img src={loseImg.src} alt='lose' className={styles.imageSize} />
        </h1>
      )}
      {finishResult?.isDraw === true && (
        <h1 className={styles.titleResult}>
          Draw <img src={drawImg.src} alt='draw' className={styles.imageSize} />
        </h1>
      )}
      <div className={styles.containerCard}>
        {/*<ScoreCard playerIndex={0} players={players} finishResult={finishResult} playerName={''} playerImg={''} showWinText={false} icon={undefined} />*/}
        {/*<ScoreCard playerIndex={1} players={players} finishResult={finishResult} playerName={''} playerImg={''} showWinText={false} icon={undefined} />*/}
      </div>
      <BlockPayedGame />
      <h2 className={styles.titleCenter}>Read more about our technology</h2>
      <div className={styles.containerBtn}>
        <CustomButton size='sm' color='gradient' radius='lg' text='Github' imagePosition='right' image='/images/git.svg' link='https://github.com/chainhackers' />
        <CustomButton size='sm' color='gradient' radius='lg' text='Publications' imagePosition='right' image='/images/publ.svg' />
      </div>
      <h2 className={styles.titleCenterBottom}>
        The dream team for your future
        <br /> games is here!
      </h2>
      <div className={styles.teamMemberWrapper}>
        <div className={styles.teamMemberContainer}>
          {team && team.map((teamMember) => <TeamMemberBasic key={teamMember.name} image={teamMember.image} name={teamMember.name} role={teamMember.role} />)}
        </div>
      </div>
      <div className={styles.containerBtnColumn}>
        <CustomButton size='lg' color='gradient' radius='lg' text='Tell us about your idea' />
        <CustomButton size='lg' color='transparent' radius='sm' text='Restart Demo' imagePosition='left' image='/images/dice.svg' />
      </div>
    </div>
  );
};
