export interface CustomButtonProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'transparent' | 'dark' | 'gradient';
  textColor?: string;
  radius?: 'sm' | 'md' | 'lg';
  text?: string;
  image?: string;
  imagePosition?: 'left' | 'right';
}
