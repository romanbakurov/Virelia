import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const ChevronUp = ({
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
      d='M11.6152 6.91503C11.8869 6.73594 12.256 6.7658 12.4951 7.00488L20.4951 15.0049C20.7685 15.2782 20.7685 15.7217 20.4951 15.9951C20.2218 16.2685 19.7783 16.2685 19.5049 15.9951L12 8.49023L4.49513 15.9951C4.22176 16.2685 3.77826 16.2685 3.50489 15.9951C3.23152 15.7217 3.23152 15.2782 3.50489 15.0049L11.5049 7.00488L11.6152 6.91503Z'
      fill={color}
    />
  </svg>
);
export default ChevronUp;
