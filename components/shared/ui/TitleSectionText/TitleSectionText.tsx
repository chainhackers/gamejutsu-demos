import React from 'react';
import styles from './TitleSectionText.module.scss';
import { ITitleSectionText } from './TitleSectionTextProps';
export const TitleSectionText = (props: ITitleSectionText) => {
  const { firstText, secondText } = props;
  return (
    <div className={styles.container}>
      <div className={styles.firstText}>{firstText}</div>
      <div className={styles.secondText}>{secondText}</div>
    </div>
  );
};

