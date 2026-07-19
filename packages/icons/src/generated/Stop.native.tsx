import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Stop = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M17.8496 7.5C17.8496 6.75442 17.2456 6.15039 16.5 6.15039H7.5C6.75442 6.15039 6.15039 6.75442 6.15039 7.5V16.5C6.15039 17.2456 6.75442 17.8496 7.5 17.8496H16.5C17.2456 17.8496 17.8496 17.2456 17.8496 16.5V7.5ZM19.6504 16.5C19.6504 18.2397 18.2397 19.6504 16.5 19.6504H7.5C5.7603 19.6504 4.34961 18.2397 4.34961 16.5V7.5C4.34961 5.7603 5.7603 4.34961 7.5 4.34961H16.5C18.2397 4.34961 19.6504 5.7603 19.6504 7.5V16.5Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </Svg>
);
export default Stop;
