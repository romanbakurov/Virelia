import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const DropdownMenu = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <svg
    viewBox='0 0 16 16'
    fill={color}
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    {...props}
  >
    <path
      d='M1.83301 6C2.84542 6 3.66682 6.82064 3.66699 7.83301C3.66683 8.84539 2.84543 9.66699 1.83301 9.66699C0.820891 9.66663 0.000164844 8.84517 0 7.83301C0.00017595 6.82086 0.820898 6.00036 1.83301 6ZM7.66699 6C8.67925 6.00018 9.5008 6.82075 9.50098 7.83301C9.50081 8.84528 8.67926 9.66681 7.66699 9.66699C6.65472 9.66682 5.83415 8.84528 5.83398 7.83301C5.83416 6.82074 6.65473 6.00018 7.66699 6ZM13.5 6C14.5124 6 15.3338 6.82064 15.334 7.83301C15.3338 8.84539 14.5124 9.66699 13.5 9.66699C12.4877 9.66682 11.6672 8.84528 11.667 7.83301C11.6672 6.82074 12.4877 6.00018 13.5 6Z'
      fill={color}
    />
  </svg>
);
export default DropdownMenu;
