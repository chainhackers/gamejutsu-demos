import React from 'react';
import styles from './TeamMemberBasic.module.scss';
import { TeamMemberBasicPropsI } from './TeamMemberBasicProps';
export const TeamMemberBasic: React.FC<TeamMemberBasicPropsI> = ({ image, name, role, }) => {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.avatar}>
          <img src={image} />
        </div>
        <div className={styles.nameRoleContainer}>
          <div className={styles.name}>{name}</div>
          <div className={styles.role}>{role}</div>
        </div>
      </div>
    </div>
  );
};
