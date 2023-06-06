import React from 'react';
import { ModalPropsI } from './ModalProps';
import styles from './Modal.module.scss';

export const Modal: React.FC<ModalPropsI> = ({
  children,
  isClosable,
  closeModal,
}) => {
  return (
    <div className={styles.shade}>
      <div className={styles.content}>
        {isClosable && (
          <div onClick={closeModal} className={styles.cross}>
            <span className={styles.line1}></span>
            <span className={styles.line2}></span>
          </div>
        )}
        {children}
        <button className={styles.close}></button>
      </div>
    </div>
  );
};
