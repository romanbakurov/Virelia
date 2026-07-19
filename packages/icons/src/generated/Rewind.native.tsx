import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Rewind = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M19.96 5.28019C20.2326 5.07578 20.5975 5.04287 20.9023 5.19523C21.2072 5.34764 21.4003 5.65915 21.4004 5.99992V18C21.4004 18.3408 21.2072 18.6522 20.9023 18.8047C20.5974 18.9571 20.2327 18.9243 19.96 18.7197L12.4004 13.0498V18C12.4004 18.3408 12.2072 18.6522 11.9023 18.8047C11.5974 18.9571 11.2327 18.9243 10.96 18.7197L2.95996 12.7197C2.73352 12.5497 2.59961 12.2831 2.59961 12C2.5997 11.7169 2.73351 11.4501 2.95996 11.2802L10.96 5.28019C11.2326 5.07578 11.5975 5.04287 11.9023 5.19523C12.2072 5.34764 12.4003 5.65915 12.4004 5.99992V10.9492L19.96 5.28019ZM4.99902 12L10.5996 16.1992V7.79974L4.99902 12ZM13.999 12L19.5996 16.1992V7.79974L13.999 12Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </Svg>
);
export default Rewind;
