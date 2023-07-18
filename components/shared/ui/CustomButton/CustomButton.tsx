import { CustomButtonProps } from './CustomButtonProps';
import styles from './CustomButton.module.scss';
import classNames from 'classnames';

export const CustomButton = (props: CustomButtonProps) => {
  const { size, color, gradient, radius, text, image, imagePosition } = props;

  const buttonClasses = classNames(styles.button, styles[`size-${size}`], styles[`color-${color}`], { [styles.gradient]: gradient }, styles[`radius-${radius}`]);

  return (
    <button className={buttonClasses}>
      {imagePosition === 'left' && <img src={image} alt='Button Image' className={styles.image} />}
      {text}
      {imagePosition === 'right' && <img src={image} alt='Button Image' className={styles.image} />}
    </button>
  );
};
