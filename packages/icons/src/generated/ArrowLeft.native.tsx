import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const ArrowLeft = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M10.3633 5.11327C10.7147 4.7618 11.2852 4.7618 11.6367 5.11327C11.9882 5.46475 11.9882 6.03524 11.6367 6.38671L6.92382 11.0996H20.25C20.747 11.0996 21.1504 11.5029 21.1504 12C21.1504 12.497 20.747 12.9004 20.25 12.9004H6.92382L11.6367 17.6133C11.9882 17.9647 11.9882 18.5352 11.6367 18.8867C11.2852 19.2382 10.7147 19.2382 10.3633 18.8867L4.11327 12.6367C3.7618 12.2852 3.7618 11.7147 4.11327 11.3633L10.3633 5.11327Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </Svg>
);
export default ArrowLeft;
