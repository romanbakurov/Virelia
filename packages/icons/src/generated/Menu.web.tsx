import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const Menu = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={color}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M20 16.8496C20.4971 16.8496 20.9004 17.2529 20.9004 17.75C20.9004 18.2471 20.4971 18.6504 20 18.6504H4C3.50294 18.6504 3.09961 18.2471 3.09961 17.75C3.09961 17.2529 3.50294 16.8496 4 16.8496H20ZM20 11.0996C20.4971 11.0996 20.9004 11.5029 20.9004 12C20.9004 12.4971 20.4971 12.9004 20 12.9004H4C3.50294 12.9004 3.09961 12.4971 3.09961 12C3.09961 11.5029 3.50294 11.0996 4 11.0996H20ZM20 5.34961C20.4971 5.34961 20.9004 5.75294 20.9004 6.25C20.9004 6.74706 20.4971 7.15039 20 7.15039H4C3.50294 7.15039 3.09961 6.74706 3.09961 6.25C3.09961 5.75294 3.50294 5.34961 4 5.34961H20Z'
      fill={color}
    />
  </svg>
);
export default Menu;
