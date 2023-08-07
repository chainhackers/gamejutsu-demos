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

  // Код SVG-компонента для крестика
  const XIcon = () => {
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

  // Код SVG-компонента для нолика
  const OIcon = () => {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' width={30} height={31} viewBox='0 0 30 31' fill='none'>
        <circle cx={15.0742} cy={15.5742} r={12.375} stroke='url(#paint0_linear_1425_7608)' strokeWidth={3} />
        <circle cx={15.0766} cy={15.5746} r={9.975} stroke='url(#paint1_linear_1425_7608)' strokeWidth={3} />
        <defs>
          <linearGradient id='paint0_linear_1425_7608' x1={15.0742} y1={1.69922} x2={15.0742} y2={29.4492} gradientUnits='userSpaceOnUse'>
            <stop stopColor='#FEFEFE' />
            <stop offset={1} stopColor='#BDBEC0' />
          </linearGradient>
          <linearGradient id='paint1_linear_1425_7608' x1={15.0766} y1={4.09961} x2={15.0766} y2={27.0496} gradientUnits='userSpaceOnUse'>
            <stop stopColor='#BEBFC1' />
            <stop offset={1} stopColor='#FDFDFD' />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={30} height={31} viewBox='0 0 30 31' fill='none' {...props}>
      {result === 'win' ? (
        <>
          <g filter={`drop-shadow(-0.86px 0.86px 1.71px ${crossStyles.shadow})`}>
            <XIcon /> // Рендерим крестик
          </g>
        </>
      ) : result === 'lose' ? (
        <>
          <OIcon /> // Рендерим нолик
        </>
      ) : (
        <>
          <g filter={`drop-shadow(-0.86px 0.86px 1.71px ${crossStyles.shadow})`}>
            <XIcon /> // Рендерим крестик
          </g>
          <OIcon /> // Рендерим нолик
        </>
      )}
    </svg>
  );
};
