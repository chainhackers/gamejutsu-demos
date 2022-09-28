import cn from 'classnames';
import { ButtonPropsI } from './ButtonProps';
import styles from './Button.module.scss';
export const Button: React.FC<ButtonPropsI> = ({
  children,
  title = 'Button',
  color = 'white',
  borderless = false,
  size = 'md',
  ...props
}) => {
  return (
    <button
      className={cn(
        styles.container,
        styles[color],
        styles[size],
        borderless ? styles.borderless : null,
        props.disabled ? styles.disabled : null,
      )}
      {...props}
    >
      {title}
      {children}
    </button>
  );
};
