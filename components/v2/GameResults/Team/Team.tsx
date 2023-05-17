import React from 'react';
import { TeamPropsI } from './TeamProps';
import styles from './Team.module.scss';
import Image from 'next/image';

export const Team: React.FC<TeamPropsI> = () => {
  return (
    <div className={styles.container}>
      <Image
        src="/images/win.svg"
        width={342}
        height={276}
        layout="responsive"
        alt="Picture of the author"
      />
    </div>
  );
};
