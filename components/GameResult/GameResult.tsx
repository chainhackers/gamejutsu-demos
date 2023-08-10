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
export const GameResult = (props: IGameResultProps) => {
  const { result, player1, player2, gameType } = props;
  // const player1 = {
  //   playerName: '0xh20...7260',
  //   playerImg: playerImg,
  //   showWinText: result === 'win',
  //   gameType: 'tic-tac-toe',
  //   icon: gameType === 'tic-tac-toe' ? <XIcon /> : <PurpleIcon />,
  // };
  // const player2 = {
  //   playerName: '0xh07...6035',
  //   playerImg: playerImg2,
  //   showWinText: result === 'lose',
  //   gameType: 'tic-tac-toe',
  //   icon: gameType ===  'tic-tac-toe' ? <OIcon /> : <WhiteIcon />,
  // };
  return (
    <div
      className={classNames(styles.container, {
        [styles.win]: result === 'win',
        [styles.lose]: result === 'lose',
        [styles.draw]: result === 'draw',
      })}>
      <h2 className={styles.title}>
        {result === 'win' && <span>Winner!</span>}
        {result === 'lose' && <span>Better Luck Next Time</span>}
        {result === 'draw' && <span>Better Luck Next Time</span>}
      </h2>
      {result === 'win' && <img src={imgWin.src} alt='Win' width={640} height={510} className={styles.imageWin} />}
      {result === 'lose' && (
        <h1 className={styles.titleResult}>
          You lose <img src={loseImg.src} alt='lose' className={styles.imageSize} />
        </h1>
      )}
      {result === 'draw' && (
        <h1 className={styles.titleResult}>
          Draw <img src={drawImg.src} alt='draw' className={styles.imageSize} />
        </h1>
      )}
      <div className={styles.containerCard}>
        {player1 && (
          <ScoreCard
            playerName={player1.playerName}
            avatarUrl={player1.avatarUrl}
            showWinText={result === 'win'}
            icon={gameType === 'tic-tac-toe' ? <XIcon /> : <PurpleIcon />}
            result={result}
            gameType={gameType}
          />
        )}
        {player2 && (
          <ScoreCard
            playerName={player2.playerName}
            avatarUrl={player2.avatarUrl}
            showWinText={result === 'lose'}
            icon={gameType === 'tic-tac-toe' ? <OIcon /> : <WhiteIcon />}
            result={result === 'win' ? 'lose' : result === 'lose' ? 'win' : result}
            gameType={gameType}
          />
        )}
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
