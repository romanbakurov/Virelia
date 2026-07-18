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
      d='M18.6162 6.11621C19.1044 5.62805 19.8956 5.62805 20.3838 6.11621C20.8719 6.60436 20.8719 7.39563 20.3838 7.88379L10.1836 18.084C9.94919 18.3183 9.63123 18.4502 9.29981 18.4502C8.96836 18.4501 8.65039 18.3184 8.41602 18.084L3.61621 13.2842C3.12812 12.7961 3.12825 12.0048 3.61621 11.5166C4.10437 11.0284 4.89563 11.0284 5.38379 11.5166L9.29981 15.4326L18.6162 6.11621Z'
      fill={color}
    />
  </svg>
);
export default Check;
