import Image from 'next/image';
import { TeamMemberPropsI } from './TeamMemberProps';
import styles from './TeamMember.module.scss';
import React from 'react';
import Link from 'next/link';

export const TeamMember: React.FC<TeamMemberPropsI> = ({ image, name, role, description, contacts }) => {
  return (
    <div className={styles.container}>
      {/* Контейнер с аватаром, именем и ролью */}
      <div className={styles.infoContainer}>
        <div className={styles.avatar}>
          <img src={image} />
        </div>
        <div className={styles.nameRoleContainer}>
          <div className={styles.name}>{name}</div>
          <div className={styles.role}>{role}</div>
        </div>
      </div>

      {/* Описание информации */}
      <div className={styles.description}>{description}</div>

      {/* Блок с кнопками контактов */}
      <div className={styles.contactsContainer}>
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
  );
};
