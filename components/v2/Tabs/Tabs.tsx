import React from 'react';
import { useState } from 'react';
import { TabsPropsI } from './TabsProps';
import styles from './Tabs.module.scss';

export const Tabs: React.FC<TabsPropsI> = () => {
  const [selectedTab, setSelectedTab] = useState<
    'Game demo' | 'Join game' | 'My games'
  >('Game demo');

  const tabsList = ['Game demo', 'Join game', 'My games'];

  return (
    <div className={styles.tabs}>
      <ul className={styles.q}>
        {tabsList.map((tab) => (
          <li key={tab}>{tab}</li>
        ))}
      </ul>
    </div>
  );
};
