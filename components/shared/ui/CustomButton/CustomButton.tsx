import { CustomButtonProps } from './CustomButtonProps';
import styles from './CustomButton.module.scss';
import cn from 'classnames';

export const CustomButton = (props: CustomButtonProps) => {
  const { size, color, radius, text, image, imagePosition } = props;

  const buttonClasses = cn(styles.button, styles[`size-${size}`], styles[`color-${color}`], styles[`radius-${radius}`], {
    [styles['text-center']]: imagePosition === 'left' || imagePosition === 'right',
  });

  return (
    <button className={buttonClasses}>
      {imagePosition === 'left' && <img src={image} alt='Button Image' className={styles.image} />}
      <span className={styles.text}>{text}</span>
      {imagePosition === 'right' && <img src={image} alt='Button Image' className={styles.image} />}
    </button>
  );
};
