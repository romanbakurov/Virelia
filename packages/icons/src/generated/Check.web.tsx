import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const Check = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={color}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M18.8633 5.86327C19.2148 5.5118 19.7853 5.5118 20.1368 5.86327C20.4882 6.21475 20.4882 6.78524 20.1368 7.13671L9.88677 17.3867C9.5353 17.7382 8.96481 17.7382 8.61334 17.3867L4.11334 12.8867C3.76186 12.5352 3.76186 11.9647 4.11334 11.6133C4.46481 11.2618 5.0353 11.2618 5.38677 11.6133L9.25005 15.4766L18.8633 5.86327Z'
      fill={color}
    />
  </svg>
);
export default Check;
