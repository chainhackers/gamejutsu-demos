import { LogoPropsI } from './LogoProps';
import Image from 'next/image';
import styles from './Logo.module.scss';
export const Logo: React.FC<LogoPropsI> = ({ image }) => {
  return (
    <div className={styles.container}>
      <Image src={image ? image : ''} width="77px" height="77px" alt="logo" />
    </div>
  );
};
