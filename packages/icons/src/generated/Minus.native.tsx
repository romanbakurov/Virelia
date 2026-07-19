import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Minus = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M19.5 11.0996C19.9971 11.0996 20.4004 11.5029 20.4004 12C20.4004 12.4971 19.9971 12.9004 19.5 12.9004H4.5C4.00294 12.9004 3.59961 12.4971 3.59961 12C3.59961 11.5029 4.00294 11.0996 4.5 11.0996H19.5Z'
      fill={color}
    />
  </Svg>
);
export default Minus;
