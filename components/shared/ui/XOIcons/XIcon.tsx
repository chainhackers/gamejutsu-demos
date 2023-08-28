import React, { SVGProps } from 'react';
interface IIconProps extends SVGProps<SVGSVGElement>{
  width?: number;
  height?: number;
}
export const XIcon: React.FC<IIconProps> = ({ width = 30, height = 30, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 30 30' fill='none'>
      <path d='M25.5 4.5L4.57399 25.5M25.426 25.5L4.5 4.5' stroke='url(#paint0_linear_1407_27451)' strokeWidth={4} strokeLinecap='round' />
      <defs>
        <linearGradient id='paint0_linear_1407_27451' x1={33.8531} y1={-4.05} x2={-4.17187} y2={33.975} gradientUnits='userSpaceOnUse'>
          <stop stopColor='#DFCAFB' />
          <stop offset={1} stopColor='#8B7ADB' />
        </linearGradient>
      </defs>
    </svg>
  );
};
