import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const ChevronLeft = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M14.8633 4.61327C15.2147 4.2618 15.7852 4.2618 16.1367 4.61327C16.4882 4.96475 16.4882 5.53524 16.1367 5.88671L10.0234 12L16.1367 18.1133C16.4882 18.4647 16.4882 19.0352 16.1367 19.3867C15.7852 19.7382 15.2147 19.7382 14.8633 19.3867L8.11327 12.6367C7.7618 12.2852 7.7618 11.7147 8.11327 11.3633L14.8633 4.61327Z'
      fill={color}
    />
  </Svg>
);
export default ChevronLeft;
