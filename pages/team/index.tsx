import { NextPage } from 'next';
import { CustomButton, TeamMember } from 'components';
import team from 'data/team.json';
import styles from './Team.module.scss';

const Team: NextPage = () => {
  return (
    <div className={styles.container}>
      {team && team.map((teamMember) => <TeamMember {...teamMember} />)}
      <div className={styles.margin}></div>
      <div className={styles.containerIdea}>
        <h2 className={styles.titleCenter}>You have an idea? We have the talents!</h2>
        <CustomButton size='lg' color='transparent' radius='sm' text='Contact us' />
      </div>
    </div>
  );
};

export default Team;
