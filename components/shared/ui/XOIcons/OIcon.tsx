import React, { SVGProps, useEffect, useState } from 'react';

interface IIconProps extends SVGProps<SVGSVGElement> {
  size?: 'small' | 'medium' | 'large';
}

export const OIcon: React.FC<IIconProps> = ({ size = 'medium', ...props }) => {
  const [iconSize, setIconSize] = useState(60); // Размер по умолчанию

  useEffect(() => {
    if (size === 'small') {
      setIconSize(30);
    } else if (size === 'large') {
      setIconSize(90);
    } else {
      setIconSize(60);
    }
  }, [size]);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={iconSize}
      height={iconSize}
      viewBox='0 0 30 31'
      fill='none'>
      <circle
        cx={15.0742}
        cy={15.5742}
        r={12.375}
        stroke='url(#paint0_linear_1425_7608)'
        strokeWidth={3}
      />
      <circle
        cx={15.0766}
        cy={15.5746}
        r={9.975}
        stroke='url(#paint1_linear_1425_7608)'
        strokeWidth={3}
      />
      <defs>
        <linearGradient
          id='paint0_linear_1425_7608'
          x1={15.0742}
          y1={1.69922}
          x2={15.0742}
          y2={29.4492}
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#FEFEFE' />
          <stop offset={1} stopColor='#BDBEC0' />
        </linearGradient>
        <linearGradient
          id='paint1_linear_1425_7608'
          x1={15.0766}
          y1={4.09961}
          x2={15.0766}
          y2={27.0496}
          gradientUnits='userSpaceOnUse'>
          <stop stopColor='#BEBFC1' />
          <stop offset={1} stopColor='#FDFDFD' />
        </linearGradient>
      </defs>
    </svg>
  );
};
