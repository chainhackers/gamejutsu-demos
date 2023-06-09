import React, { useEffect, useState } from 'react';
import { MyGamesList } from 'components/v2/MyGamesList';
import { getRulesContract } from 'gameApi';
import { MyGamesWrapperPropsI } from './MyGamesWrapperProps';

export const MyGamesWrapper: React.FC<MyGamesWrapperPropsI> = ({
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
    <div>
      {rulesContractAddress && (
        <MyGamesList
          gameType={gameType}
          rulesContractAddress={rulesContractAddress}
        />
      )}
    </div>
  );
};
