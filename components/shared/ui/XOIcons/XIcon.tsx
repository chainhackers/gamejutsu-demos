import React, { SVGProps } from 'react';
export const XIcon = (props: SVGProps<SVGSVGElement> & { result: 'win' | 'lose' | 'draw' }) => {
  const { result } = props;
  const crossStyles = {
    fill1: result === 'win' ? '#E3CEFC' : 'white',
    fill2: result === 'win' ? '#B4A1EA' : 'white',
    stroke: result === 'win' ? '#B4A1EA' : '#DEDFE0',
    shadow: result === 'win' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(61, 66, 97, 0.30)',
  };
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={30} height={30} viewBox='0 0 30 30' fill='none'>
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
