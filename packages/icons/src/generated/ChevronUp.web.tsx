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
      d='M11.4316 8.05174C11.7851 7.76329 12.3072 7.78371 12.6367 8.11326L19.3867 14.8633C19.7382 15.2147 19.7382 15.7852 19.3867 16.1367C19.0352 16.4882 18.4647 16.4882 18.1133 16.1367L12 10.0234L5.88671 16.1367C5.53524 16.4882 4.96475 16.4882 4.61327 16.1367C4.2618 15.7852 4.2618 15.2147 4.61327 14.8633L11.3633 8.11326L11.4316 8.05174Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </svg>
);
export default ChevronUp;
