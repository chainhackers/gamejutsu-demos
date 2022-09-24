import { Button, Players } from 'components';
import { LeftPanelPropsI } from './LeftPanelProps';
import styles from './LeftPanel.module.scss';
export const LeftPanel: React.FC<LeftPanelPropsI> = ({
  players,
  isDisputAvailable,
  onRunDisput,
  ...props
}) => {
  return (
    <div className={styles.container}>
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
