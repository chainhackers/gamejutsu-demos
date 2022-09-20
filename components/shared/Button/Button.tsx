import cn from 'classnames';
import { ButtonPropsI } from './ButtonProps';
import styles from './Button.module.scss';
export const Button: React.FC<ButtonPropsI> = ({
  children,
  title = 'Button',
  color = 'white',
  borderless = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        styles.container,
        styles[color],
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
