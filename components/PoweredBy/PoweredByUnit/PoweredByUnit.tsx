import { Logo } from 'components/Logo';
import { PoweredByUnitPropsI } from './PoweredByUnitProps';
import styles from './PoweredByUnit.module.scss';

export const PoweredByUnit: React.FC<PoweredByUnitPropsI> = ({ name, image, href }) => {
  return (
    <div className={styles.container}>
      <a href={href} target="_blank">
        <Logo image={image} />
        <div className={styles.name}>{name}</div>
      </a>
    </div>
  );
};
