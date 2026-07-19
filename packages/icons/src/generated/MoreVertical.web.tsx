import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const MoreVertical = ({
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
      d='M12 17.6504C12.7455 17.6504 13.3496 18.2545 13.3496 19C13.3496 19.7456 12.7455 20.3496 12 20.3496C11.2544 20.3496 10.6494 19.7456 10.6494 19C10.6494 18.2544 11.2544 17.6504 12 17.6504ZM12 10.6504C12.7455 10.6504 13.3496 11.2545 13.3496 12C13.3496 12.7456 12.7455 13.3496 12 13.3496C11.2544 13.3496 10.6494 12.7456 10.6494 12C10.6494 11.2544 11.2544 10.6504 12 10.6504ZM12 3.65039C12.7455 3.65044 13.3496 4.25446 13.3496 5C13.3496 5.74555 12.7455 6.34956 12 6.34961C11.2544 6.34961 10.6494 5.74558 10.6494 5C10.6494 4.25443 11.2544 3.65039 12 3.65039Z'
      fill={color}
    />
  </svg>
);
export default MoreVertical;
