import React, { createContext, useContext, useEffect, useState } from 'react';
import Web3Modal, { IProviderOptions, providers } from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers, Signer } from 'ethers';
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
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [signer, setSigner] = useState<Signer>();
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    const infuraId = process.env.NEXT_PUBLIC_INFURA_ID || 'b6058e03f2cd4108ac890d3876a56d0d'; // TODO: set up own infuraID
    const providerOptions: IProviderOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
        },
      },
    };

    const modal = new Web3Modal({ cacheProvider: true, providerOptions });

    setWeb3Modal(modal);
  }, []);

  useEffect(() => {
    const connect = async () => {
      if (!web3Modal) {
        return;
        // throw new Error('web3Modal not initialized')
      }
      const instance = await web3Modal.connect();

      console.log('instance', instance);

      if (!instance) return;
      const provider = new ethers.providers.Web3Provider(instance, 'any');

      console.log('provider', provider);

      const newSigner = provider.getSigner();
      console.log('newSigner', newSigner);

      setSigner(newSigner);

      const address = await newSigner.getAddress();

      console.log(address);

      // setAddress(address);
    };
    connect();
  }, [web3Modal]);

  const value = {
    signer,
    address,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
