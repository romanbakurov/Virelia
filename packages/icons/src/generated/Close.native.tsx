import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Close = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M17.6133 5.11327C17.9648 4.7618 18.5353 4.7618 18.8867 5.11327C19.2381 5.46475 19.2382 6.03527 18.8867 6.38672L13.2735 12L18.8867 17.6133C19.2381 17.9648 19.2382 18.5353 18.8867 18.8867C18.5353 19.2382 17.9648 19.2381 17.6133 18.8867L12 13.2735L6.38672 18.8867C6.03527 19.2382 5.46475 19.2381 5.11327 18.8867C4.7618 18.5353 4.7618 17.9648 5.11327 17.6133L10.7266 12L5.11327 6.38672C4.7618 6.03524 4.7618 5.46475 5.11327 5.11327C5.46475 4.7618 6.03524 4.7618 6.38672 5.11327L12 10.7266L17.6133 5.11327Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </Svg>
);
export default Close;
