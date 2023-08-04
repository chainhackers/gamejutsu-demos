import React from 'react';
export interface ButtonPropsI extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  title?: string;
  color?: string;
  borderless?: boolean;
  size?: 'sm' | 'md';
}
