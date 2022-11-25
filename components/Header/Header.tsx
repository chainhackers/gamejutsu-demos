import { useTranslation } from 'react-i18next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Logo, Navigation, NavPath } from 'components';
import { HeaderPropsI } from './HeaderProps';
import styles from './Header.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
export const Header: React.FC<HeaderPropsI> = ({version}) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const parsedPath = asPath.split('/').filter((el) => el.length !== 0);
  const currentPath = parsedPath[0];

  return (
    <div className={styles.container}>
      {asPath !== '/' && currentPath?.split('?')[0] !== 'connect' ? (
        <NavPath path={asPath} />
      ) : // <NavPath path={'Game Demo'} />
      null}
      <div className={styles.left}>
        <Link href="/">
          <a>
            <Logo image="/logo/gj-logo.png" />
          </a>
        </Link>
        <div className={styles.version}>{`Ver.${version}`}</div>
      </div>
      <div className={styles.right}>
        {currentPath?.split('?')[0] !== 'connect' && <Navigation active={currentPath} />}
        {currentPath?.split('?')[0] !== 'connect' && <ConnectButton />}
      </div>
    </div>
  );
};
