import * as React from 'react';
import { SVGProps } from 'react';
export const WhiteIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={30} height={30} viewBox='0 0 68 68' fill='none' {...props}>
      <g filter='url(#filter0_d_768_24880)'>
        <circle cx={36} cy={32} r={30} fill='url(#paint0_linear_768_24880)' />
        <circle cx={35.9982} cy={31.9982} r={24.9865} fill='url(#paint1_linear_768_24880)' />
        <circle cx={35.999} cy={31.999} r={19.029} fill='white' stroke='#DEDFE0' strokeWidth={1.84615} />
        <circle cx={36.0009} cy={32.0009} r={13.2927} fill='white' stroke='#DEDFE0' strokeWidth={1.84615} />
      </g>
      <defs>
        <filter id='filter0_d_768_24880' x={0.461537} y={0.153846} width={67.3846} height={67.3846} filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
          <feFlood floodOpacity={0} result='BackgroundImageFix' />
          <feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
          <feOffset dx={-1.84615} dy={1.84615} />
          <feGaussianBlur stdDeviation={1.84615} />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix type='matrix' values='0 0 0 0 0.239216 0 0 0 0 0.258824 0 0 0 0 0.380392 0 0 0 0.3 0' />
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_768_24880' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_768_24880' result='shape' />
        </filter>
        <linearGradient id='paint0_linear_768_24880' x1={36} y1={2} x2={36} y2={62} gradientUnits='userSpaceOnUse'>
          <stop stopColor='white' />
          <stop offset={1} stopColor='#BBBCBE' />
        </linearGradient>
        <linearGradient id='paint1_linear_768_24880' x1={35.9982} y1={7.01172} x2={35.9982} y2={56.9847} gradientUnits='userSpaceOnUse'>
          <stop stopColor='#BDBEC0' />
          <stop offset={1} stopColor='white' />
        </linearGradient>
      </defs>
    </svg>
  );
};
