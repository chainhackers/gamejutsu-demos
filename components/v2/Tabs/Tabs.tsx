import React from 'react';
import { useState } from 'react';
import { TabsPropsI } from './TabsProps';
import styles from './Tabs.module.scss';

export const Tabs: React.FC<TabsPropsI> = ({
  tabsList,
  selectedTab,
  onClick,
}) => {
  return (
    <div className={styles.tabs}>
      <ul className={styles.q}>
        {tabsList.map((tab) => (
          <li
            className={selectedTab === tab ? styles.selected : ''}
            key={tab}
            onClick={() => onClick(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
};
