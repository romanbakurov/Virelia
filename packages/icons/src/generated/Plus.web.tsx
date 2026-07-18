import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const Plus = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={color}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M11.2998 20V12.7002H4C3.6134 12.7002 3.2998 12.3866 3.2998 12C3.2998 11.6134 3.6134 11.2998 4 11.2998H11.2998V4C11.2998 3.6134 11.6134 3.2998 12 3.2998C12.3866 3.2998 12.7002 3.6134 12.7002 4V11.2998H20C20.3866 11.2998 20.7002 11.6134 20.7002 12C20.7002 12.3866 20.3866 12.7002 20 12.7002H12.7002V20C12.7002 20.3866 12.3866 20.7002 12 20.7002C11.6134 20.7002 11.2998 20.3866 11.2998 20Z'
      fill={color}
    />
  </svg>
);
export default Plus;
