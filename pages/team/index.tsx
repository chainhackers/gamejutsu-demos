import { NextPage } from 'next';
import { CustomButton, TeamMember, TitleSectionText } from 'components';
import team from 'data/team.json';
import styles from './Team.module.scss';

const Team: NextPage = () => {
  return (
    <div className={styles.container}>
      <TitleSectionText firstText='Meet Our Team' secondText='Enthusiasts of making products better' />
      {team && team.map((teamMember) => <TeamMember {...teamMember} key={teamMember.name} />)}
      <div className={styles.margin}></div>
      <div className={styles.containerIdea}>
        <h2 className={styles.titleCenter}>
          You have an idea? <br className={styles.break} />
          We have the talents!
        </h2>
        <div className={styles.customButton}>
          <CustomButton size='lg' color='transparent' radius='sm' text='Contact us' />
        </div>
      </div>
    </div>
  );
};

export default Team;
