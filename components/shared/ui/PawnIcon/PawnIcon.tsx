import * as React from 'react';
import { SVGProps } from 'react';
export const PawnIcon = (props: SVGProps<SVGSVGElement> & { result: 'win' | 'lose' | 'draw' }) => {
  const { result } = props;
  const iconStyles = {
    fill1: result === 'win' ? '#E3CEFC' : 'white',
    fill2: result === 'win' ? '#B4A1EA' : 'white',
    stroke: result === 'win' ? '#B4A1EA' : '#DEDFE0',
    shadow: result === 'win' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(61, 66, 97, 0.30)',
  };
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={34} height={34} viewBox='0 0 34 34' fill='none' {...props}>
      <g filter={`drop-shadow(-0.86px 0.86px 1.71px ${iconStyles.shadow})`}>
        <circle cx='18' cy='16' r='15' fill={iconStyles.fill2} />
        <circle cx='18.0011' cy='15.9991' r='12.4932' fill={iconStyles.fill1} />
        <circle cx='17.9995' cy='15.9995' r='9.54748' fill={iconStyles.fill1} stroke={iconStyles.stroke} strokeWidth='0.857143' />
        <circle cx='17.9985' cy='16.0005' r='6.67932' fill={iconStyles.fill1} stroke={iconStyles.stroke} strokeWidth='0.857143' />
      </g>
    </svg>
  );
};
