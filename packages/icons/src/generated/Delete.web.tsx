import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const Delete = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <svg
    viewBox='0 0 16 16'
    fill={color}
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    {...props}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M10.3333 2.625H13V5.875H12.1667L11.3333 14H4.66667L3.83333 5.875H3V2.625H5.66667C6 1.65 6.91667 1 8 1C9.08333 1 10 1.65 10.3333 2.625ZM3.83333 3.4375H6.33333V3.1125C6.5 2.38125 7.25 1.8125 8 1.8125C8.75 1.8125 9.5 2.38125 9.66667 3.1125V3.4375H12.1667V5.0625H3.83333V3.4375ZM11.3333 5.875L10.5 13.1875H5.5L4.75 5.875H11.3333Z'
      fill={color}
    />
  </svg>
);
export default Delete;
