import React from 'react';
import { WalletModalProps } from './WallletModalProps';
import styles from './WalletModal.module.scss';
import { Modal } from '../Modal';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';

export const WalletModal: React.FC<WalletModalProps> = ({ closeModal }) => {
  const { asPath } = useRouter();
  const parsedPath = asPath.split('/').filter((el) => el.length !== 0);
  const currentPath = parsedPath[0];

  function renderConnectButton() {
    return (
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');

          if (currentPath?.split('?')[0] === 'connect') {
            return null;
          }

          if (!connected) {
            return (
              <button onClick={openConnectModal} type="button">
                Connect Wallet
              </button>
            );
          }

          if (chain.unsupported) {
            return (
              <button onClick={openChainModal} type="button">
                Wrong network
              </button>
            );
          }
        }}
      </ConnectButton.Custom>
    );
  }
  return (
    <>
      <Modal isClosable={true} closeModal={closeModal}>
        <div className={styles.container}>
          <h4 className={styles.title}>Connect your Wallet</h4>
          <img src="/images/wallet.svg" alt="wallet" />
          <div onClick={closeModal}>{renderConnectButton()}</div>
          <span className={styles.description}>
            Connection lets you use GameJutsu Demo App with your Ethereum
            account
          </span>
        </div>
      </Modal>
    </>
  );
};
