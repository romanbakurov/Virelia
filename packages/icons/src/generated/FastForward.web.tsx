import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const FastForward = ({
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
      d='M12.0977 5.19523C12.4025 5.04287 12.7674 5.07578 13.04 5.28019L21.04 11.2802C21.2665 11.4501 21.4003 11.7169 21.4004 12C21.4004 12.2831 21.2665 12.5497 21.04 12.7197L13.04 18.7197C12.7673 18.9243 12.4026 18.9571 12.0977 18.8047C11.7928 18.6522 11.5996 18.3408 11.5996 18V13.0498L4.04004 18.7197C3.76732 18.9243 3.40256 18.9571 3.09766 18.8047C2.79282 18.6522 2.59961 18.3408 2.59961 18V5.99992C2.59972 5.65915 2.79284 5.34764 3.09766 5.19523C3.40248 5.04287 3.76737 5.07578 4.04004 5.28019L11.5996 10.9492V5.99992C11.5997 5.65915 11.7928 5.34764 12.0977 5.19523ZM4.40039 16.1992L10 12L4.40039 7.79974V16.1992ZM13.4004 16.1992L19 12L13.4004 7.79974V16.1992Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </svg>
);
export default FastForward;
