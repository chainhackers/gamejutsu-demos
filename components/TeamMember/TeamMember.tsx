import Image from 'next/image';
import { TeamMemberPropsI } from './TeamMemberProps';
import styles from './TeamMember.module.scss';
import React from 'react';
import Link from 'next/link';

export const TeamMember: React.FC<TeamMemberPropsI> = ({ image, name, role, description, contacts }) => {
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <img src={image} />
      </div>
      <div className={styles.information}>
        <div className={styles.header}>
          <div className={styles.name}>{name}</div>
          <div className={styles.contacts}>
            {contacts.map((contact) => (
              <div className={styles.contactsElement}>
                <Link href={contact.ref} target='_blank'>
                  <a target='_blank'>
                    <Image src={contact.image} width='30px' height='30px' />
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.role}>{role}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
};
