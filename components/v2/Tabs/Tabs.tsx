import React from 'react'
import { useState } from 'react'
import { TabsPropsI } from './TabsProps'
import styles from './Tabs.module.scss'

export const Tabs: React.FC<TabsPropsI> = () => {

  const [tabState, setTabState] = useState(null)

  return (
    <div className={styles.q}>

    </div>
  )
}
