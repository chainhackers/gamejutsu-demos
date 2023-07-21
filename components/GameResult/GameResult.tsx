'use client';
import Image from 'next/image';
import classNames from 'classnames';
import styles from './GameResult.module.scss';
import imgWin from 'public/images/win.png';
import playerImg from 'public/logo/account-avatar.png';
import playerImg2 from 'public/logo/account-avatar2.png';
import loseImg from 'public/images/lose.svg';
import drawImg from 'public/images/draw.svg';
import { GameResultProps } from './GameResultProps';
import { BlockPayedGame, Button, CustomButton } from 'components/shared';
import { ScoreCard } from 'components/GameResult/ScoreCard/index';
import { TeamMemberBasic } from 'components/shared/ui/TeamMemberBasic';
import team from 'data/team.json';
export const GameResult = (props: GameResultProps) => {
  const { result } = props;
  const resultClass = classNames(styles.container, {
    [styles.win]: result === 'win',
    [styles.lose]: result === 'lose',
    [styles.draw]: result === 'draw',
  });
  const player1 = {
    playerName: '0xh20...7260',
    playerImg: playerImg,
    showWinText: result === 'win',
  };
  const player2 = {
    playerName: '0xh07...6035',
    playerImg: playerImg2,
    showWinText: result === 'lose',
  };
  let content;

  if (result === 'win') {
    content = (
      <div className={resultClass}>
        <h2 className={styles.title}>
          <span>Winner!</span>
          <span className={styles.titleRight}>Results</span>
        </h2>
        <Image src={imgWin} alt='Win' />
        <div className={styles.containerCard}>
          <ScoreCard {...player1} result={result} />
          <ScoreCard {...player2} result={'lose'} />
        </div>
        <BlockPayedGame />
        <h2 className={styles.titleCenter}>Read more about our technology</h2>
        <div className={styles.containerBtn}>
          <CustomButton size='sm' color='gradient' radius='lg' text='Github' imagePosition='right' image='/images/git.svg' link='https://github.com/chainhackers' imageSize='36' />
          <CustomButton size='sm' color='gradient' radius='lg' text='Publications' imagePosition='right' image='/images/publ.svg' imageSize='36' />
        </div>
        <h2 className={styles.titleCenterBottom}>The dream team for your future games is here!</h2>
        <div className={styles.teamMemberWrapper}>
          <div className={styles.teamMemberContainer}>{team && team.map((teamMember) => <TeamMemberBasic image={teamMember.image} name={teamMember.name} role={teamMember.role} />)}</div>
        </div>
        <div className={styles.containerBtnColumn}>
          <CustomButton size='lg' color='gradient' radius='lg' text='Tell us about your idea' />
          <CustomButton size='lg' color='transparent' radius='sm' text='Restart Demo' imagePosition='left' image='/images/dices.svg' />
        </div>
      </div>
    );
  } else if (result === 'lose') {
    content = (
      <div className={resultClass}>
        <h2 className={styles.title}>
          <span>Better Luck Next Time</span>
          <span className={styles.titleRight}>Results</span>
        </h2>
        <h1 className={styles.titleResult}>
          You lose <img src={loseImg.src} alt='lose' className={styles.imageSize} />
        </h1>
        <div className={styles.containerCard}>
          <ScoreCard {...player1} result={result} />
          <ScoreCard {...player2} result={'win'} />
        </div>
        <BlockPayedGame />
        <h2 className={styles.titleCenter}>Read more about our technology</h2>
        <div className={styles.containerBtn}>
          <CustomButton size='sm' color='gradient' radius='lg' text='Github' imagePosition='right' image='/images/git.svg' />
          <CustomButton size='sm' color='gradient' radius='lg' text='Publications' imagePosition='right' image='/images/publ.svg' />
        </div>
        <h2 className={styles.titleCenter}>The dream team for your future games is here!</h2>
        <div className={styles.containerBtnColumn}>
          <CustomButton size='lg' color='gradient' radius='lg' text='Tell us about your idea' />
          <CustomButton size='lg' color='transparent' radius='sm' text='Restart Demo' imagePosition='left' image='/images/dices.svg' />
        </div>
      </div>
    );
  } else if (result === 'draw') {
    content = (
      <div className={resultClass}>
        <h2 className={styles.title}>
          <span>Better Luck Next Time</span>
          <span className={styles.titleRight}>Results</span>
        </h2>
        <h1 className={styles.titleResult}>
          Draw <img src={drawImg.src} alt='draw' className={styles.imageSize} />
        </h1>
        <div className={styles.containerCard}>
          <ScoreCard {...player1} result={result} />
          <ScoreCard {...player2} result={result} />
        </div>
        <BlockPayedGame />
        <h2 className={styles.titleCenter}>Read more about our technology</h2>
        <div className={styles.containerBtn}>
          <CustomButton size='sm' color='gradient' radius='lg' text='Github' imagePosition='right' image='/images/git.svg' />
          <CustomButton size='sm' color='gradient' radius='lg' text='Publications' imagePosition='right' image='/images/publ.svg' />
        </div>
        <h2 className={styles.titleCenter}>The dream team for your future games is here!</h2>
        <div className={styles.containerBtnColumn}>
          <CustomButton size='lg' color='gradient' radius='lg' text='Tell us about your idea' />
          <CustomButton size='lg' color='transparent' radius='sm' text='Restart Demo' imagePosition='left' image='/images/dices.svg' />
        </div>
      </div>
    );
  }

  return <>{content}</>;
};
