import React, { SVGProps } from 'react';

export const XOIcon = (props: SVGProps<SVGSVGElement> & { result: 'win' | 'lose' | 'draw' }) => {
  const { result } = props;
  const crossStyles = {
    fill1: result === 'win' ? '#E3CEFC' : 'white',
    fill2: result === 'win' ? '#B4A1EA' : 'white',
    stroke: result === 'win' ? '#B4A1EA' : '#DEDFE0',
    shadow: result === 'win' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(61, 66, 97, 0.30)',
  };

  const circleStyles = {
    fill1: result === 'win' ? '#FEFEFE' : '#BEBFC1',
    fill2: result === 'win' ? '#DFCAFB' : '#BDBEC0',
    stroke: result === 'win' ? '#BDBEC0' : '#FDFDFD',
  };

  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={30} height={31} viewBox='0 0 30 31' fill='none' {...props}>
      {result === 'win' ? (
        <>
          <g filter={`drop-shadow(-0.86px 0.86px 1.71px ${crossStyles.shadow})`}>
            <path d='M25.5 4.5L4.57399 25.5M25.426 25.5L4.5 4.5' stroke={crossStyles.stroke} strokeWidth='4' strokeLinecap='round' />
          </g>
        </>
      ) : result === 'lose' ? (
        <>
          <circle cx='15.0742' cy='15.5742' r='12.375' stroke={circleStyles.fill1} strokeWidth='3' />
          <circle cx='15.0766' cy='15.5746' r='9.975' fill={circleStyles.fill2} stroke={circleStyles.stroke} strokeWidth='3' />
        </>
      ) : (
        <>
          <g filter={`drop-shadow(-0.86px 0.86px 1.71px ${crossStyles.shadow})`}>
            <path d='M25.5 4.5L4.57399 25.5M25.426 25.5L4.5 4.5' stroke={crossStyles.stroke} strokeWidth='4' strokeLinecap='round' />
          </g>
          <circle cx='15.0742' cy='15.5742' r='12.375' stroke={circleStyles.fill1} strokeWidth='3' />
          <circle cx='15.0766' cy='15.5746' r='9.975' fill={circleStyles.fill2} stroke={circleStyles.stroke} strokeWidth='3' />
        </>
      )}
    </svg>
  );
};
