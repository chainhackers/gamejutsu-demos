import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import empty_avatar from 'public/images/empty_avatar.png';
import { SelectGamePropsI } from './SelectGameProps';
import styles from './SelectGame.module.scss';
import { useState } from 'react';
import { useRouter } from 'next/router';
import gameApi from 'gameApi';
export const SelectGame: React.FC<SelectGamePropsI> = ({
  userName,
  gameType,
  onProposeGame,
  arbiterContractData,
  gameRulesContractData,
}) => {
  const [isCreatingNewGame, setCreatingNewGame] = useState<boolean>(false);
  const [creatingGameError, setCreatingGameError] = useState<string | null>(null);

  const router = useRouter();

  const createNewGameHandler = async () => {
    setCreatingNewGame(true);
    setCreatingGameError(null);

    try {
      let { gameId } = await gameApi.proposeGame(
        gameApi.fromContractData(arbiterContractData),
        gameRulesContractData.address,
      );
      console.log(gameId);
      if (!!gameId) {
        gameId = gameId.toString();
        // console.log('gameId', gameId);
        // setGameId(gameId);
        // setPlayerIngameId(PROPOSER_INGAME_ID);
        // setPlayerType(playersTypes[PROPOSER_INGAME_ID]);
        // setGameStatus('Proposed');
        onProposeGame(gameId);
        router.push('/games/' + gameType + '?prize=true');
      }
    } catch (e) {
      setCreatingGameError('Failed to create new game');
      console.error(e);
    } finally {
      setTimeout(() => setCreatingNewGame(false), 3000);
    }
  };
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('selectGame.title')}</div>
      <div className={styles.description}>{t('selectGame.description')}</div>
      <div className={styles.avatar}>
        <Image src={empty_avatar} alt={'avatat'} width="61px" height="61px"></Image>
      </div>
      <div className={styles.userName}>
        {userName ? userName : t('selectGame.unknownUser')}
      </div>
      {!isCreatingNewGame && (
        <div className={styles.selection}>
          <div className={styles.new}>
            <div className={styles.title}>{t('selectGame.new.title')}</div>
            <div className={styles.description}>{t('selectGame.new.description')}</div>
            {/* <Link href={'/games/' + gameType + '?prize=true'}> */}
            {/* <a> */}
            <div className={styles.button} onClick={createNewGameHandler}>
              {t('selectGame.new.button')}
            </div>
            {/* </a> */}
            {/* </Link> */}
          </div>
          <div className={styles.join}>
            <div className={styles.title}>{t('selectGame.join.title')}</div>
            <div className={styles.description}>{t('selectGame.join.description')}</div>
            <Link href={'/games/' + gameType + '?join=true'}>
              <a>
                <div className={styles.button}>{t('selectGame.join.button')}</div>
              </a>
            </Link>
          </div>
        </div>
      )}
      {creatingGameError && <div className={styles.error}>{creatingGameError}</div>}
      {isCreatingNewGame && <div className={styles.newGameLoader}>Creating new game...</div>}
    </div>
  );
};
