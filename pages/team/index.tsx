import { NextPage } from 'next';
import { TeamMember } from 'components';
import team from 'data/team.json';
import styles from './Team.module.scss';

const Team: NextPage = () => {
    return (
        <div className={styles.container}>
            {team && team.map((teamMember) => <TeamMember {...teamMember} />)}
        </div>
    );
};

export default Team;
