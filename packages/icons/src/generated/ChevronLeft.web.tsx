import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const ChevronLeft = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={color}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M15.0049 3.50489C15.2783 3.23152 15.7218 3.23152 15.9951 3.50489C16.2685 3.77826 16.2685 4.22176 15.9951 4.49513L8.49024 12L15.9951 19.5049C16.2685 19.7783 16.2685 20.2218 15.9951 20.4951C15.7218 20.7685 15.2783 20.7685 15.0049 20.4951L7.00489 12.4951C6.73152 12.2218 6.73152 11.7783 7.00489 11.5049L15.0049 3.50489Z'
      fill={color}
    />
  </svg>
);
export default ChevronLeft;
