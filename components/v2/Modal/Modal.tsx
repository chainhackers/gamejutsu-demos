import React from 'react';
import { ModalPropsI } from './ModalProps';
import styles from './Modal.module.scss';

export const Modal: React.FC<ModalPropsI> = ({ children }) => {
  return (
    <div className={styles.shade}>
      <div className={styles.content}>
        {children}
        <button className={styles.close}></button>
      </div>
    </div>
  );
};
