import React from 'react';
import { LogoPropsI } from './LogoProps';
import Image from 'next/image';
import styles from './Logo.module.scss';
import Link from 'next/link';
export const Logo = React.forwardRef<HTMLImageElement, LogoPropsI>(({ image, href = '/', style }) => {
  return (
    <Link href={href}>
      <a className={styles.container} style={style}>
        <Image src={image as string} width={38} height={52} alt='logo' />
      </a>
    </Link>
  );
});
