import { useTranslation } from 'react-i18next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Logo, Navigation, NavPath } from 'components';
import { HeaderPropsI } from './HeaderProps';
import styles from './Header.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
export const Header: React.FC<HeaderPropsI> = ({ version }) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const parsedPath = asPath.split('/').filter((el) => el.length !== 0);
  const currentPath = parsedPath[0];

  function renderConnectButton() {
    return (
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
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

          return (
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={openAccountModal} type="button">
                {account.displayBalance ? ` (${account.displayBalance})` : ''}
                {account.displayName}
              </button>
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  }

  return (
		<div className={styles.container}>
			{asPath !== "/" && currentPath?.split("?")[0] !== "connect" ? (
				<NavPath path={asPath} />
			) : // <NavPath path={'Game Demo'} />
			null}
			<div className={styles.left}>
				<Link href="/">
					<a>
						<Logo image="/logo/gj-logo-ninja.png" />
					</a>
				</Link>
				<h3 className={styles.text}>
					GAME<span className={styles.textColor}>JUTSU</span>
				</h3>
				<div className={styles.version}>{`ver. ${version}`}</div>
			</div>
			<div className={styles.right}>
				{/* {currentPath?.split('?')[0] !== 'connect' && <Navigation active={currentPath} />} */}
				{currentPath?.split("?")[0] !== "connect" && <div className={styles.customConnect}>{renderConnectButton()}</div>}
			</div>
		</div>
	)
};
