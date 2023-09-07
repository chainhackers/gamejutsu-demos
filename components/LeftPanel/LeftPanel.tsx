import { useTranslation } from 'react-i18next';
import { Button, CustomButton, Players } from 'components';
import { LeftPanelPropsI } from './LeftPanelProps';
import styles from './LeftPanel.module.scss';
import React from 'react';
import disputeIcon from 'public/images/disputeIcon.svg';
import hourglassIcon from 'public/images/hourglassIcon.svg'

export const LeftPanel: React.FC<LeftPanelPropsI> = ({
  players,
  isDisputAvailable,
  onRunDisput,
  gameId,
  ...props
}) => {
  const { t } = useTranslation();
  console.log('DISABLED', onRunDisput)
  return (
    <div className={styles.container}>
      <div className={styles.gameId}>
        <strong className={styles.protocolLogs}>{t('leftpanel.protocolLogs')} </strong>
        <strong>{t('leftpanel.gameId')}:</strong>
        &nbsp;{gameId && !Number.isNaN(gameId) ? gameId : 'n/a'}
      </div>
      <Players player1={players[0]} player2={players[1]} {...props} />
      <div className={styles.buttons}>
        {/*<Button*/}
        {/*  size='sm'*/}
        {/*  color='red'*/}
        {/*  borderless*/}
        {/*  title='Dispute move'*/}
        {/*  // disabled={!isDisputAvailable}*/}
        {/*  // onClick={onRunDisput}*/}
        {/*/>*/}
        <div className={styles.containerBtn}>
          <CustomButton
            size='sm'
            color='transparent'
            radius='sm'
            text='Init Timeout'
            image={hourglassIcon.src}
            imageSize='24'
            imagePosition={"right"}
            disabled={!isDisputAvailable}
            onClick={onRunDisput}
          />
          <CustomButton
            size='sm'
            color='transparent'
            radius='sm'
            text='Dispute Move'
            image={disputeIcon.src}
            imageSize='24'
            imagePosition={"right"}
            disabled={!isDisputAvailable}
            onClick={onRunDisput}
          />
        </div>
      </div>
    </div>
  );
};
