import { LogoPropsI } from './LogoProps';
import Image from 'next/image';
import styles from './Logo.module.scss';
export const Logo: React.FC<LogoPropsI> = ({ image, href }) => {
  return (
    <a href={href} className={styles.container}>
      <Image src={image as string} width={32} height={42} alt='logo' />
    </a>
  );
};
