import { ICustomButtonProps } from './CustomButtonProps';
import styles from './CustomButton.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { FC } from 'react';

export const CustomButton: FC<ICustomButtonProps> = ({
  size,
  color,
  radius,
  text,
  image,
  imagePosition,
  link,
  imageSize,
  ...rest
}) => {

  const buttonClasses = cn(
    styles.button,
    styles[`size-${size}`],
    styles[`color-${color}`],
    styles[`radius-${radius}`],
    rest.disabled ? styles.disabled : null,
    {
      [styles['text-center']]: imagePosition === 'left' || imagePosition === 'right',
    },
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
    <button className={buttonClasses} {...rest}>
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
