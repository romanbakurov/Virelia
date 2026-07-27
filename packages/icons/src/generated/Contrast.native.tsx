import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Contrast = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM12 4.61982C7.92414 4.61982 4.61982 7.92414 4.61982 12C4.61982 16.0759 7.92414 19.3802 12 19.3802C16.0759 19.3802 19.3802 16.0759 19.3802 12C19.3802 7.92414 16.0759 4.61982 12 4.61982ZM12 6.6C14.9823 6.6 17.4 9.01766 17.4 12C17.4 14.9823 14.9823 17.4 12 17.4C9.01766 17.4 6.6 14.9823 6.6 12C6.6 9.01766 9.01766 6.6 12 6.6Z'
      fill={color}
    />
  </Svg>
);
export default Contrast;
