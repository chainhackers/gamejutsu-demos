import React, { useEffect, useState } from 'react';
import { JoinGameWrapperPropsI } from './JoinGameWrapperProps';
import { JoinGameList } from 'components';
import { getRulesContract } from 'gameApi';

export const JoinGameWrappper: React.FC<JoinGameWrapperPropsI> = ({
  onClick,
  gameType,
}) => {
  const [rulesContractAddress, setRulesContractAddress] = useState<
    string | null
  >(null);
  useEffect(() => {
    getRulesContract(gameType).then((response) =>
      setRulesContractAddress(response.address)
    );
  }, [gameType]);
  return (
    <>
      {rulesContractAddress && (
        <JoinGameList
          onClick={onClick}
          gameType={gameType}
          rulesContractAddress={rulesContractAddress}
        />
      )}
    </>
  );
};
