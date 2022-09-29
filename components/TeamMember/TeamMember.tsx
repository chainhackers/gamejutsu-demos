import Image from 'next/image';
import { TeamMemberPropsI } from './TeamMemberProps';
import styles from './TeamMember.module.scss';
export const TeamMember: React.FC<TeamMemberPropsI> = ({
    image,
    name,
    possition,
    description,
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.avatar}>
                <Image className={styles.image} src={image} width="155px" height="155px" />
            </div>
            <div className={styles.information}>
                <div className={styles.name}>{name}</div>
                <div className={styles.possition}>{possition}</div>
                <div className={styles.description}>{description}</div>
            </div>
        </div>
    );
};
