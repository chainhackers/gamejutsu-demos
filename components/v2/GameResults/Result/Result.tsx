import React from 'react';
import { ResultPropsI } from './ResultProps';
import styles from './Result.module.scss';
import Image from 'next/image';
import { Players } from '../Players';

export const Result: React.FC<ResultPropsI> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image
          src='/images/win.svg'
          width={342}
          height={276}
          layout='responsive'
          alt='Game result'
        />
      </div>
      <div className={styles.players}>
        <Players />
      </div>
    </div>
  );
};
