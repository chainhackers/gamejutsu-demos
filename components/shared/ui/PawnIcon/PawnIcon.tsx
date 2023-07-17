import * as React from 'react';
import { SVGProps } from 'react';
export const PawnIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={34} height={34} viewBox='0 0 34 34' fill='none' {...props}>
    <g filter='url(#a)'>
      <circle cx={18} cy={16} r={15} fill='url(#b)' />
      <circle cx={18.001} cy={15.999} r={12.493} fill='url(#c)' />
      <circle cx={18} cy={15.999} r={9.547} fill='#E3CEFC' stroke='#B4A1EA' strokeWidth={0.857} />
      <circle cx={17.998} cy={16} r={6.679} fill='#E3CEFC' stroke='#B4A1EA' strokeWidth={0.857} />
    </g>
    <defs>
      <linearGradient id='b' x1={18} y1={1} x2={18} y2={31} gradientUnits='userSpaceOnUse'>
        <stop stopColor='#E3CEFC' />
        <stop offset={1} stopColor='#8777DA' />
      </linearGradient>
      <linearGradient id='c' x1={18.001} y1={3.506} x2={18.001} y2={28.492} gradientUnits='userSpaceOnUse'>
        <stop stopColor='#8777DA' />
        <stop offset={1} stopColor='#E3CEFC' />
      </linearGradient>
      <filter id='a' x={0.429} y={0.143} width={33.429} height={33.429} filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
        <feFlood floodOpacity={0} result='BackgroundImageFix' />
        <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
        <feOffset dx={-0.857} dy={0.857} />
        <feGaussianBlur stdDeviation={0.857} />
        <feComposite in2='hardAlpha' operator='out' />
        <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0' />
        <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_768_24612' />
        <feBlend in='SourceGraphic' in2='effect1_dropShadow_768_24612' result='shape' />
      </filter>
    </defs>
  </svg>
);
