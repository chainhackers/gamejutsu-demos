export interface ICustomButtonProps {
  onClick?: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'transparent' | 'dark' | 'gradient';
  textColor?: string;
  radius?: 'sm' | 'md' | 'lg';
  text?: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  link?: string;
  imageSize?: string;
}
