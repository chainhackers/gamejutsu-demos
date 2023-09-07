import cn from 'classnames';
import { IPlayerTypeProps } from './PlayerTypeProps';
import styles from './PlayerType.module.scss';
import { classNames } from 'components/Conversation/helpers';
import { OIcon, XIcon } from '../../../shared/ui/XOIcons';
import React from 'react';

export const PlayerType: React.FC<IPlayerTypeProps> = ({ playerIngameId }) => {
  return (
    <div className={cn(styles.container, {})}>
      {playerIngameId === 0 ? <XIcon size='medium' /> : <OIcon size='medium' />}
    </div>
  );
};
