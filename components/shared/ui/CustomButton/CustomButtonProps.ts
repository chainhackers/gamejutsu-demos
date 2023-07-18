export interface CustomButtonProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'transparent' | 'dark' | 'gradient';
  gradient?: boolean;
  textColor?: string;
  radius?: 'sm' | 'md' | 'lg';
  text?: string;
  image?: string;
  imagePosition: 'left' | 'right';
}
