import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const CreditCard = ({
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
      d='M18.25 4.09961C20.1278 4.09961 21.6504 5.62223 21.6504 7.5V16.5C21.6504 18.3778 20.1278 19.9004 18.25 19.9004H5.75C3.87223 19.9004 2.34961 18.3778 2.34961 16.5V7.5C2.34961 5.62223 3.87223 4.09961 5.75 4.09961H18.25ZM4.15039 10.1504V16.5C4.15039 17.3837 4.86634 18.0996 5.75 18.0996H18.25C19.1337 18.0996 19.8496 17.3837 19.8496 16.5V10.1504H4.15039ZM11 13.8496C11.4971 13.8496 11.9004 14.2529 11.9004 14.75C11.9004 15.2471 11.4971 15.6504 11 15.6504H7C6.50294 15.6504 6.09961 15.2471 6.09961 14.75C6.09961 14.2529 6.50294 13.8496 7 13.8496H11ZM5.75 5.90039C4.86634 5.90039 4.15039 6.61634 4.15039 7.5V8.34961H19.8496V7.5C19.8496 6.61634 19.1337 5.90039 18.25 5.90039H5.75Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </svg>
);
export default CreditCard;
