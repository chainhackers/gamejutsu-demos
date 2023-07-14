import React, { useState } from 'react';
import styles from './ScoreCard.module.scss';
import { ScoreCardProps } from './ScoreCardProps';
import Image from 'next/image';
export const ScoreCard = (props: ScoreCardProps) => {
  const { playerName, result, playerImg } = props;
  const [highlight, setHighlight] = useState(false);

  const handleHighlight = () => {
    setHighlight(true);
  };

  return (
    <div className={`${styles.card} ${highlight ? styles.highlight : ''}`}>
      <Image src={playerImg} alt="Player" width={24} height={24}/>
      <p>{playerName}</p>
      {result === 'win' && <p>Win</p>}
    </div>
  );
};

