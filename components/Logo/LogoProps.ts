import { StaticImageData } from 'next/image';
import { CSSProperties } from 'react';
export interface LogoPropsI {
  children?: React.ReactNode;
  image?: string | StaticImageData;
  href?: string;
  style?: CSSProperties;
}
