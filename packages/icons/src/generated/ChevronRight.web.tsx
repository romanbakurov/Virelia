import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const ChevronRight = ({
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
      d='M8.00489 3.50489C8.27826 3.23152 8.72176 3.23152 8.99513 3.50489L16.9951 11.5049C17.2685 11.7783 17.2685 12.2218 16.9951 12.4951L8.99513 20.4951C8.72176 20.7685 8.27826 20.7685 8.00489 20.4951C7.73152 20.2218 7.73152 19.7783 8.00489 19.5049L15.5098 12L8.00489 4.49513C7.73152 4.22176 7.73152 3.77826 8.00489 3.50489Z'
      fill={color}
    />
  </svg>
);
export default ChevronRight;
