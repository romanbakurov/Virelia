import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const More = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={color}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M4.99999 13.7C5.93887 13.7 6.69999 12.9389 6.69999 12C6.69999 11.0611 5.93887 10.3 4.99999 10.3C4.0611 10.3 3.29999 11.0611 3.29999 12C3.29999 12.9389 4.0611 13.7 4.99999 13.7Z'
      fill={color}
    />
    <path
      d='M12 13.7C12.9389 13.7 13.7 12.9389 13.7 12C13.7 11.0611 12.9389 10.3 12 10.3C11.0611 10.3 10.3 11.0611 10.3 12C10.3 12.9389 11.0611 13.7 12 13.7Z'
      fill={color}
    />
    <path
      d='M19 13.7C19.9389 13.7 20.7 12.9389 20.7 12C20.7 11.0611 19.9389 10.3 19 10.3C18.0611 10.3 17.3 11.0611 17.3 12C17.3 12.9389 18.0611 13.7 19 13.7Z'
      fill={color}
    />
  </svg>
);
export default More;
