import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const Minus = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={color}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M19.5 11.0996C19.9971 11.0996 20.4004 11.5029 20.4004 12C20.4004 12.4971 19.9971 12.9004 19.5 12.9004H4.5C4.00294 12.9004 3.59961 12.4971 3.59961 12C3.59961 11.5029 4.00294 11.0996 4.5 11.0996H19.5Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </svg>
);
export default Minus;
