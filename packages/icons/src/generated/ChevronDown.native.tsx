import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const ChevronDown = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M19.5049 8.00489C19.7783 7.73152 20.2218 7.73152 20.4951 8.00489C20.7685 8.27826 20.7685 8.72176 20.4951 8.99513L12.4951 16.9951C12.2218 17.2685 11.7783 17.2685 11.5049 16.9951L3.50489 8.99513C3.23152 8.72176 3.23152 8.27826 3.50489 8.00489C3.77826 7.73152 4.22176 7.73152 4.49513 8.00489L12 15.5098L19.5049 8.00489Z'
      fill={color}
    />
  </Svg>
);
export default ChevronDown;
