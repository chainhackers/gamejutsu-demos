import { NextPage } from 'next';
import { TeamMember } from 'components/v2/TeamMember';
import team from 'data/team.json';
import styles from './Team.module.scss';

const Team: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meet Our Team</h1>
      <p className={styles.subTitle}>Enthusiasts of making products better</p>
      <div className={styles.team}>
        {team && team.map((teamMember) => <TeamMember {...teamMember} />)}
      </div>
      <div className={styles.contact}>
        <h4 className={styles.title}>
          You have an idea? <br /> We have the talents!
        </h4>
        <div className={styles.gradientBorder}>
          <button>Contact us</button>
        </div>
      </div>
    </div>
  );
};

export default Team;
