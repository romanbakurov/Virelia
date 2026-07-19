import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const ArrowUp = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M11.0996 20.25V6.92381L6.38671 11.6367C6.03524 11.9882 5.46475 11.9882 5.11327 11.6367C4.7618 11.2852 4.7618 10.7147 5.11327 10.3633L11.3633 4.11326L11.4316 4.05174C11.7851 3.76329 12.3072 3.78371 12.6367 4.11326L18.8867 10.3633C19.2382 10.7147 19.2382 11.2852 18.8867 11.6367C18.5352 11.9882 17.9647 11.9882 17.6133 11.6367L12.9004 6.92381V20.25C12.9004 20.747 12.497 21.1504 12 21.1504C11.5029 21.1504 11.0996 20.747 11.0996 20.25Z'
      fill={color}
    />
  </Svg>
);
export default ArrowUp;
