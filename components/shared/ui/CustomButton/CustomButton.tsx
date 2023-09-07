import { CustomButtonProps } from './CustomButtonProps';
import styles from './CustomButton.module.scss';
import cn from 'classnames';
import Link from 'next/link';

export const CustomButton = (props: CustomButtonProps) => {
  const { disabled, size, color, radius, text, image, imagePosition, link, imageSize } = props;

  const buttonClasses = cn(
    styles.button,
    styles[`size-${size}`],
    styles[`color-${color}`],
    styles[`radius-${radius}`],
    {
      [styles['text-center']]: imagePosition === 'left' || imagePosition === 'right',
    },
    props.disabled ? styles.disabled : null,
  );

  const imageStyles = {
    width: imageSize ? `${imageSize}px` : undefined,
    height: imageSize ? `${imageSize}px` : undefined,
  };

  if (link) {
    return (
      <Link href={link} target='_blank'>
        <a target='_blank' className={buttonClasses}>
          {imagePosition === 'left' && (
            <img src={image} alt='Button Image' className={styles.image} style={imageStyles} />
          )}
          <span className={styles.text}>{text}</span>
          {imagePosition === 'right' && (
            <img src={image} alt='Button Image' className={styles.image} style={imageStyles} />
          )}
        </a>
      </Link>
    );
  }

  return (
    <button className={buttonClasses} {...props}>
      {imagePosition === 'left' && (
        <img src={image} alt='Button Image' className={styles.image} style={imageStyles} />
      )}
      <span className={styles.text}>{text}</span>
      {imagePosition === 'right' && (
        <img src={image} alt='Button Image' className={styles.image} style={imageStyles} />
      )}
    </button>
  );
};
