import { useTranslation } from 'react-i18next';
import { signMove } from 'helpers/session_signatures';
import { Button, CustomButton, Players } from 'components';
import { LeftPanelPropsI } from './LeftPanelProps';
import styles from './LeftPanel.module.scss';
import React from 'react';
import disputeIcon from 'public/images/disputeIcon.svg';
import hourglassIcon from 'public/images/hourglassIcon.svg';
import { FaKey } from 'react-icons/fa';
import { ISignedGameMove } from '../../types/arbiter';
import Blockies from 'react-blockies';
import Image from 'next/image';
import playerImg from '../../public/images/empty_avatar.png';
import { useGameStateContext } from '../../contexts/GameStateContext';

export const LeftPanel: React.FC<LeftPanelPropsI> = ({
  players,
  isDisputAvailable,
  onRunDisput,
  gameId,
  ...props
}) => {
  const { t } = useTranslation();
  // const { playerResult } = useGameStateContext()
  // const address = playerResult.address
  console.log('DISABLED', onRunDisput);

  const jeremy = '0xx00000x00000';
  // const storedSignatures = localStorage.getItem('signatures');
  // const parsedStoredSignatures = storedSignatures ? JSON.parse(storedSignatures) : {};
  // const signatureInfo = parsedStoredSignatures[signMove.signatures[0]];

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
            imagePosition={'right'}
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
            imagePosition={'right'}
            disabled={!isDisputAvailable}
            onClick={onRunDisput}
          />
        </div>
        <div className={styles.containerSessionKey}>
          <h2 className={styles.titleKey}>
            Your Session Key <FaKey />
          </h2>
          <span className={styles.key}>
            {jeremy ? (
              <Blockies
                seed={!!jeremy ? jeremy : '0x00000000000'}
                size={6}
                className='rounded-full'
              />
            ) : (
              <Image src={playerImg.src} alt='Player' width={24} height={24} />
            )}
            0x!!sessionWalletAddress!!!sessionWalletAddress
          </span>
        </div>
      </div>
    </div>
  );
};
