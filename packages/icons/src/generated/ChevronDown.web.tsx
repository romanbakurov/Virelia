import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const ChevronDown = ({
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
      d='M18.1133 7.86327C18.4647 7.5118 19.0352 7.5118 19.3867 7.86327C19.7382 8.21475 19.7382 8.78524 19.3867 9.13671L12.6367 15.8867C12.2852 16.2382 11.7147 16.2382 11.3633 15.8867L4.61327 9.13671C4.2618 8.78524 4.2618 8.21475 4.61327 7.86327C4.96475 7.5118 5.53524 7.5118 5.88671 7.86327L12 13.9766L18.1133 7.86327Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </svg>
);
export default ChevronDown;
