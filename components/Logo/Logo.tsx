import { LogoPropsI } from './LogoProps';
import Image from 'next/image';
import styles from './Logo.module.scss';
export const Logo: React.FC<LogoPropsI> = ({ image }) => {
  return (
		<div className={styles.container}>
			<Image src={image ? image : ""} width="32px" height="42px" alt="logo" />
			
		</div>
	)
};
