import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const Moon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={color}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M9.71105 3C8.86111 4.37231 8.37219 5.97218 8.37219 7.68134C8.37219 12.7737 12.7016 16.902 18.0421 16.902C19.074 16.902 20.0676 16.7461 21 16.4607C19.3175 19.1769 16.2179 21 12.67 21C7.32938 21 3 16.8718 3 11.7794C3 7.67124 5.81803 4.19201 9.71105 3Z'
      fill={color}
    />
  </svg>
);
export default Moon;
