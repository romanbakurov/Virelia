import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Send = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M2.64743 3.58103C2.91103 3.34372 3.28989 3.28323 3.61423 3.42674L21.1142 11.1767C21.4398 11.3209 21.6504 11.6439 21.6504 12C21.6504 12.3561 21.4398 12.679 21.1142 12.8232L3.61423 20.5732C3.28989 20.7167 2.91103 20.6562 2.64743 20.4189C2.38388 20.1815 2.28463 19.8112 2.39352 19.4736L4.80368 12L2.39352 4.52635C2.28463 4.18876 2.38388 3.81842 2.64743 3.58103ZM4.7236 18.1123L16.4941 12.9004H6.40524L4.7236 18.1123ZM6.40524 11.0996H16.4941L4.7236 5.8867L6.40524 11.0996Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </Svg>
);
export default Send;
