import { useTranslation } from 'react-i18next';
import { PoweredByUnit } from './PoweredByUnit';
import { PoweredByPropsI } from './PoweredByProps';
import styles from './PoweredBy.module.scss';
export const PoweredBy: React.FC<PoweredByPropsI> = ({ poweredByList }) => {
  const { t } = useTranslation();
  console.log(poweredByList);
  return (
    <div className={styles.container}>
      <div className={styles.title}>{t('poweredBy.title')}</div>
      <div className={styles.units}>
        {poweredByList.map((unit, index) => (
          <PoweredByUnit key={`unit.name-${index}`} {...unit} />
        ))}
      </div>
    </div>
  );
};
