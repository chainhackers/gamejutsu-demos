import { useTranslation } from 'react-i18next';
import { Button, Players } from 'components';
import { LeftPanelPropsI } from './LeftPanelProps';
import styles from './LeftPanel.module.scss';
export const LeftPanel: React.FC<LeftPanelPropsI> = ({
  players,
  isDisputAvailable,
  onRunDisput,
  gameId,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.gameid}>
        <strong className={styles.protocolLogs}>{t('leftpanel.protocolLogs')} </strong>
        <strong>{t('leftpanel.gameId')}:</strong>
        &nbsp;{gameId && !Number.isNaN(gameId) ? gameId : 'n/a'}
      </div>
      <Players player1={players[0]} player2={players[1]} {...props} />
      <div className={styles.buttons}>
        <Button
          size="sm"
          color="red"
          borderless
          title="Dispute move"
          disabled={!isDisputAvailable}
          onClick={onRunDisput}
        />
      </div>
    </div>
  );
};
