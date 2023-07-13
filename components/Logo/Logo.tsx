import React from 'react';
import { LogoPropsI } from './LogoProps';
import Image from 'next/image';
import styles from './Logo.module.scss';
export const Logo = React.forwardRef<HTMLImageElement, LogoPropsI>(({ image, href }, ref) => {
  return (
    <a href={href} className={styles.container}>
      <Image src={image as string} width={32} height={42} alt='logo'  />
    </a>
  );
});
