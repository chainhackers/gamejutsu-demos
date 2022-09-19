// import { Logo } from 'components';
import { HeaderPropsI } from './HeaderProps';
import styles from './Header.module.scss';
export const Header: React.FC<HeaderPropsI> = () => {
  return (
    <div className={styles.container}>
      {/* <Logo /> */}
    </div>
  );
};
