import { LogoPropsI } from './LogoProps';
import styles from './Logo.module.scss';
export const Logo: React.FC<LogoPropsI> = () => {
  return <div className={styles.container}>Logo</div>;
};
