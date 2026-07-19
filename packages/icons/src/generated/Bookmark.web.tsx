import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const Bookmark = ({
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
      d='M17.75 2.59961C18.2471 2.59961 18.6504 3.00294 18.6504 3.5V20.5C18.6504 20.8251 18.4747 21.1247 18.1914 21.2842C17.9079 21.4435 17.5601 21.4377 17.2822 21.2686L12 18.0527L6.71777 21.2686C6.43993 21.4377 6.09214 21.4435 5.80859 21.2842C5.52535 21.1247 5.34961 20.8251 5.34961 20.5V3.5C5.34961 3.00294 5.75294 2.59961 6.25 2.59961H17.75ZM7.15039 18.8984L11.5322 16.2314L11.6426 16.1738C11.9082 16.0588 12.2162 16.0783 12.4678 16.2314L16.8496 18.8984V4.40039H7.15039V18.8984Z'
      fill={color}
    />
  </svg>
);
export default Bookmark;
