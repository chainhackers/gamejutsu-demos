import React from 'react';
import { AboutPropsI } from './AboutProps';
import styles from './About.module.scss';

export const About: React.FC<AboutPropsI> = () => {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Read more about our technology</h4>
      <div className={styles.buttons}>
        <a href='https://github.com/ChainHackers'>
          <span>Github</span>
          <img src='/images/github-logo.svg' alt='github logotype' />
        </a>
        <a href='https://github.com/ChainHackers'>
          <span>Publications</span>
          <img src='/images/publ.svg' alt='publications' />
        </a>
      </div>
    </div>
  );
};
