import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const ArrowRight = ({
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
      d='M12.3633 5.11327C12.7148 4.7618 13.2852 4.7618 13.6367 5.11327L19.8867 11.3633C20.2382 11.7147 20.2382 12.2852 19.8867 12.6367L13.6367 18.8867C13.2852 19.2382 12.7148 19.2382 12.3633 18.8867C12.0118 18.5352 12.0118 17.9647 12.3633 17.6133L17.0762 12.9004H3.75C3.25294 12.9004 2.84961 12.497 2.84961 12C2.84961 11.5029 3.25294 11.0996 3.75 11.0996H17.0762L12.3633 6.38671C12.0118 6.03524 12.0118 5.46475 12.3633 5.11327Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </svg>
);
export default ArrowRight;
