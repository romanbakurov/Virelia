import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const Tablet = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={color}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M17 1.84961C19.0158 1.84961 20.6504 3.48416 20.6504 5.5V18.5C20.6504 20.5158 19.0158 22.1504 17 22.1504H7C4.98416 22.1504 3.34961 20.5158 3.34961 18.5V5.5C3.34961 3.48416 4.98416 1.84961 7 1.84961H17ZM7 3.65039C5.97827 3.65039 5.15039 4.47827 5.15039 5.5V18.5C5.15039 19.5217 5.97827 20.3496 7 20.3496H17C18.0217 20.3496 18.8496 19.5217 18.8496 18.5V5.5C18.8496 4.47827 18.0217 3.65039 17 3.65039H7ZM13.5 17.5996C13.9971 17.5996 14.4004 18.0029 14.4004 18.5C14.4004 18.9971 13.9971 19.4004 13.5 19.4004H10.5C10.0029 19.4004 9.59961 18.9971 9.59961 18.5C9.59961 18.0029 10.0029 17.5996 10.5 17.5996H13.5Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </svg>
);
export default Tablet;
