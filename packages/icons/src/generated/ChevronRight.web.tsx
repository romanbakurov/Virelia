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
      d='M7.86327 4.61327C8.21475 4.2618 8.78524 4.2618 9.13671 4.61327L15.8867 11.3633C16.2382 11.7147 16.2382 12.2852 15.8867 12.6367L9.13671 19.3867C8.78524 19.7382 8.21475 19.7382 7.86327 19.3867C7.5118 19.0352 7.5118 18.4647 7.86327 18.1133L13.9766 12L7.86327 5.88671C7.5118 5.53524 7.5118 4.96475 7.86327 4.61327Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </svg>
);
export default ChevronRight;
