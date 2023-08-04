import { TeamMemberPropsI } from './TeamMemberProps';
import styles from './TeamMember.module.scss';
import React from 'react';
import { CustomButton } from 'components/shared';
export const TeamMember: React.FC<TeamMemberPropsI> = ({ image, name, role, description, contacts }) => {
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
      <div className={styles.description}>{description}</div>
      <div className={styles.contactsContainer}>
        {contacts?.map((contact) => (
          <div className={styles.contactsElement} key={contact.ref}>
            <CustomButton size='xs' color='gradient' radius='md' text={contact.type} image={contact.image} imagePosition='right' link={contact.ref} imageSize='24' />
          </div>
        ))}
      </div>
    </div>
  );
};
