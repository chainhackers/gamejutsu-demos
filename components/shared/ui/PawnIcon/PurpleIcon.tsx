import * as React from 'react';
import { SVGProps } from 'react';
export const PurpleIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={30} height={30} viewBox='0 0 70 70' fill='none' {...props}>
      <g filter='url(#filter0_d_768_24873)'>
        <circle cx={37} cy={33} r={30} fill='url(#paint0_linear_768_24873)' />
        <ellipse cx={37.0021} cy={33.0021} rx={24.9865} ry={24.9865} fill='url(#paint1_linear_768_24873)' />
        <circle cx={36.999} cy={32.999} r={18.8092} fill='#E3CEFC' stroke='#B4A1EA' strokeWidth={2.28571} />
        <path
          d='M50.0758 33.0029C50.0758 40.2229 44.2229 46.0758 37.0029 46.0758C29.7829 46.0758 23.93 40.2229 23.93 33.0029C23.93 25.7829 29.7829 19.93 37.0029 19.93C44.2229 19.93 50.0758 25.7829 50.0758 33.0029Z'
          fill='#E3CEFC'
          stroke='#B4A1EA'
          strokeWidth={2.28571}
        />
      </g>
      <defs>
        <filter id='filter0_d_768_24873' x={0.142857} y={0.714286} width={69.1429} height={69.1429} filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
          <feFlood floodOpacity={0} result='BackgroundImageFix' />
          <feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
          <feOffset dx={-2.28571} dy={2.28571} />
          <feGaussianBlur stdDeviation={2.28571} />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0' />
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_768_24873' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_768_24873' result='shape' />
        </filter>
        <linearGradient id='paint0_linear_768_24873' x1={37} y1={3} x2={37} y2={63} gradientUnits='userSpaceOnUse'>
          <stop stopColor='#E3CEFC' />
          <stop offset={1} stopColor='#8777DA' />
        </linearGradient>
        <linearGradient id='paint1_linear_768_24873' x1={37.0021} y1={8.01563} x2={37.0021} y2={57.9886} gradientUnits='userSpaceOnUse'>
          <stop stopColor='#8777DA' />
          <stop offset={1} stopColor='#E3CEFC' />
        </linearGradient>
      </defs>
    </svg>
  );
};
