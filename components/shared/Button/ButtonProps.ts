import React from 'react';
export interface ButtonPropsI extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  title?: string;
  color?: 'black' | 'white' | 'red';
  borderless?: boolean;
  size?: 'sm' | 'md';
}
