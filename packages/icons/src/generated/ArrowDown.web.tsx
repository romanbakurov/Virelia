import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const ArrowDown = ({
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
      d='M11.0996 3.75C11.0996 3.25294 11.5029 2.84961 12 2.84961C12.497 2.84961 12.9004 3.25294 12.9004 3.75V17.0762L17.6133 12.3633C17.9647 12.0118 18.5352 12.0118 18.8867 12.3633C19.2382 12.7148 19.2382 13.2852 18.8867 13.6367L12.6367 19.8867C12.2852 20.2382 11.7147 20.2382 11.3633 19.8867L5.11327 13.6367C4.7618 13.2852 4.7618 12.7148 5.11327 12.3633C5.46475 12.0118 6.03524 12.0118 6.38671 12.3633L11.0996 17.0762V3.75Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </svg>
);
export default ArrowDown;
