import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers, Signer } from 'ethers';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { getSigner } from 'gameApi';
interface WalletContextProps {
  signer: Signer | undefined;
  address: string | undefined;
}

const walletContextDefaultValue = {
  signer: undefined,
  address: undefined,
};

export const WalletContext = createContext<WalletContextProps>(walletContextDefaultValue);
export const useWalletContext = () => useContext(WalletContext);
export const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [signer, setSigner] = useState<Signer>();
  const [address, setAddress] = useState<string>();
  const account = useAccount();
  // const connect = useConnect();
  // const disconnect = useDisconnect();
  // console.log('account', account);
  // console.log('connect', connect);
  // console.log('disconnect', disconnect);

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    const connect = async () => {

      // let ethereum = await detectEthereumProvider();
      
      let signer = getSigner();
      setSigner(signer);

      // console.log(account);
      
    };
    connect();
  }, []);

  const value = {
    signer,
    address,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
