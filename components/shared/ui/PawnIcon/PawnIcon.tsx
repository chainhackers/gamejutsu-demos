import * as React from 'react';
import { SVGProps } from 'react';
import classnames from 'classnames';
import styles from './PawnIcon.module.scss';
export const PawnIcon = (props: SVGProps<SVGSVGElement> & { result: 'win' | 'lose' | 'draw' }) => {
  const { result } = props;
  const iconClass = classnames({
    [styles.win]: result === 'win',
    [styles.lose]: result !== 'win',
  });
  const fill1 = result === 'win' ? '#E3CEFC' : 'white';
  const fill2 = result === 'win' ? '#B4A1EA' : 'white';
  const stroke = result === 'win' ? '#B4A1EA' : '#DEDFE0';
  const shadow = result === 'win' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(61, 66, 97, 0.30)';

  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={34} height={34} viewBox='0 0 34 34' fill='none' {...props}>
      <g filter={`drop-shadow(-0.8571428656578064px 0.8571428656578064px 1.7142857313156128px ${shadow})`}>
        <circle cx='18' cy='16' r='15' fill={fill1} />
        <circle cx='18.0011' cy='15.9991' r='12.4932' fill={fill2} />
        <circle cx='17.9995' cy='15.9995' r='9.54748' fill={fill1} stroke={stroke} strokeWidth='0.857143' />
        <circle cx='17.9985' cy='16.0005' r='6.67932' fill={fill1} stroke={stroke} strokeWidth='0.857143' />
      </g>
    </svg>
  );
};
