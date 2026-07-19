import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Close = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M18.5049 4.50488C18.7783 4.23151 19.2218 4.23151 19.4951 4.50488C19.7684 4.77825 19.7685 5.22176 19.4951 5.49511L12.9893 12L19.4951 18.5049C19.7684 18.7783 19.7685 19.2218 19.4951 19.4951C19.2218 19.7685 18.7783 19.7684 18.5049 19.4951L12 12.9893L5.49511 19.4951C5.22176 19.7685 4.77825 19.7684 4.50488 19.4951C4.23151 19.2218 4.23151 18.7783 4.50488 18.5049L11.0098 12L4.50488 5.49511C4.23151 5.22174 4.23151 4.77824 4.50488 4.50488C4.77824 4.23151 5.22174 4.23151 5.49511 4.50488L12 11.0098L18.5049 4.50488Z'
      fill={color}
    />
  </Svg>
);
export default Close;
