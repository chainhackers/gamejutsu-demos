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
// TODO uncoment and use @habdevs #166  
// import * as React from 'react';
// import { SVGProps } from 'react';
// export const PawnIcon = (props: SVGProps<SVGSVGElement> & { result: 'win' | 'lose' | 'draw' }) => {
//   const { result } = props;
//   const crossStyles = {
//     fill1: result === 'win' ? '#E3CEFC' : 'white',
//     fill2: result === 'win' ? '#B4A1EA' : 'white',
//     stroke: result === 'win' ? '#B4A1EA' : '#DEDFE0',
//     shadow: result === 'win' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(61, 66, 97, 0.30)',
//   };
//   const PurpleIcon = () => {
//     return (
//       <svg xmlns='http://www.w3.org/2000/svg' width={70} height={70} viewBox='0 0 70 70' fill='none' {...props}>
//         <g filter='url(#filter0_d_768_24873)'>
//           <circle cx={37} cy={33} r={30} fill='url(#paint0_linear_768_24873)' />
//           <ellipse cx={37.0021} cy={33.0021} rx={24.9865} ry={24.9865} fill='url(#paint1_linear_768_24873)' />
//           <circle cx={36.999} cy={32.999} r={18.8092} fill='#E3CEFC' stroke='#B4A1EA' strokeWidth={2.28571} />
//           <path
//             d='M50.0758 33.0029C50.0758 40.2229 44.2229 46.0758 37.0029 46.0758C29.7829 46.0758 23.93 40.2229 23.93 33.0029C23.93 25.7829 29.7829 19.93 37.0029 19.93C44.2229 19.93 50.0758 25.7829 50.0758 33.0029Z'
//             fill='#E3CEFC'
//             stroke='#B4A1EA'
//             strokeWidth={2.28571}
//           />
//         </g>
//         <defs>
//           <filter id='filter0_d_768_24873' x={0.142857} y={0.714286} width={69.1429} height={69.1429} filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
//             <feFlood floodOpacity={0} result='BackgroundImageFix' />
//             <feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
//             <feOffset dx={-2.28571} dy={2.28571} />
//             <feGaussianBlur stdDeviation={2.28571} />
//             <feComposite in2='hardAlpha' operator='out' />
//             <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0' />
//             <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_768_24873' />
//             <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_768_24873' result='shape' />
//           </filter>
//           <linearGradient id='paint0_linear_768_24873' x1={37} y1={3} x2={37} y2={63} gradientUnits='userSpaceOnUse'>
//             <stop stopColor='#E3CEFC' />
//             <stop offset={1} stopColor='#8777DA' />
//           </linearGradient>
//           <linearGradient id='paint1_linear_768_24873' x1={37.0021} y1={8.01563} x2={37.0021} y2={57.9886} gradientUnits='userSpaceOnUse'>
//             <stop stopColor='#8777DA' />
//             <stop offset={1} stopColor='#E3CEFC' />
//           </linearGradient>
//         </defs>
//       </svg>
//     );
//   };
//   const WhiteIcon = () => {
//     return (
//       <svg xmlns='http://www.w3.org/2000/svg' width={68} height={68} viewBox='0 0 68 68' fill='none' {...props}>
//         <g filter='url(#filter0_d_768_24880)'>
//           <circle cx={36} cy={32} r={30} fill='url(#paint0_linear_768_24880)' />
//           <circle cx={35.9982} cy={31.9982} r={24.9865} fill='url(#paint1_linear_768_24880)' />
//           <circle cx={35.999} cy={31.999} r={19.029} fill='white' stroke='#DEDFE0' strokeWidth={1.84615} />
//           <circle cx={36.0009} cy={32.0009} r={13.2927} fill='white' stroke='#DEDFE0' strokeWidth={1.84615} />
//         </g>
//         <defs>
//           <filter id='filter0_d_768_24880' x={0.461537} y={0.153846} width={67.3846} height={67.3846} filterUnits='userSpaceOnUse' colorInterpolationFilters='sRGB'>
//             <feFlood floodOpacity={0} result='BackgroundImageFix' />
//             <feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
//             <feOffset dx={-1.84615} dy={1.84615} />
//             <feGaussianBlur stdDeviation={1.84615} />
//             <feComposite in2='hardAlpha' operator='out' />
//             <feColorMatrix type='matrix' values='0 0 0 0 0.239216 0 0 0 0 0.258824 0 0 0 0 0.380392 0 0 0 0.3 0' />
//             <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_768_24880' />
//             <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_768_24880' result='shape' />
//           </filter>
//           <linearGradient id='paint0_linear_768_24880' x1={36} y1={2} x2={36} y2={62} gradientUnits='userSpaceOnUse'>
//             <stop stopColor='white' />
//             <stop offset={1} stopColor='#BBBCBE' />
//           </linearGradient>
//           <linearGradient id='paint1_linear_768_24880' x1={35.9982} y1={7.01172} x2={35.9982} y2={56.9847} gradientUnits='userSpaceOnUse'>
//             <stop stopColor='#BDBEC0' />
//             <stop offset={1} stopColor='white' />
//           </linearGradient>
//         </defs>
//       </svg>
//     );
//   };

//   return (
//     <svg xmlns='http://www.w3.org/2000/svg' width={30} height={31} viewBox='0 0 30 31' fill='none' {...props}>
//       {result === 'win' ? (
//         <>
//           <g filter={`drop-shadow(-0.86px 0.86px 1.71px ${crossStyles.shadow})`}>
//             return (
//             <svg xmlns='http://www.w3.org/2000/svg' width={30} height={31} viewBox='0 0 30 31' fill='none' {...props}>
//               {result === 'win' ? (
//                 <>
//                   <g filter={`drop-shadow(-0.86px 0.86px 1.71px ${crossStyles.shadow})`}>
//                     <PurpleIcon />
//                   </g>
//                 </>
//               ) : result === 'lose' ? (
//                 <>
//                   <WhiteIcon />
//                 </>
//               ) : (
//                 <>
//                   <g filter={`drop-shadow(-0.86px 0.86px 1.71px ${crossStyles.shadow})`}>
//                     <PurpleIcon />
//                   </g>
//                   <WhiteIcon />
//                 </>
//               )}
//             </svg>
//             );
//           </g>
//         </>
//       ) : result === 'lose' ? (
//         <>
//           <WhiteIcon />
//         </>
//       ) : (
//         <>
//           <g filter={`drop-shadow(-0.86px 0.86px 1.71px ${crossStyles.shadow})`}>
//             <PurpleIcon />
//           </g>
//           <WhiteIcon />
//         </>
//       )}
//     </svg>
//   );
// };