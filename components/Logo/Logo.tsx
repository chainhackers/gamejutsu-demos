import React from 'react';
import { LogoPropsI } from './LogoProps';
import Image from 'next/image';
import styles from './Logo.module.scss';
import Link from 'next/link';
export const Logo = (props: LogoPropsI) => {
  const { image, style } = props;
  return (
    <Link href='/'>
      <a className={styles.container} style={style}>
        <Image src={image as string} width={38} height={52} alt='logo' />
      </a>
    </Link>
  );
};
