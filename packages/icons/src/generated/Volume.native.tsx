import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Volume = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M11.4277 5.05568C11.6965 4.83431 12.0688 4.78796 12.3838 4.93654C12.6987 5.08518 12.9004 5.40175 12.9004 5.75002V18.25C12.9004 18.5983 12.6987 18.9149 12.3838 19.0635C12.0688 19.2121 11.6965 19.1657 11.4277 18.9444L7.42773 15.6504H4.25C3.75294 15.6504 3.34961 15.2471 3.34961 14.75V9.25002C3.34961 8.75296 3.75294 8.34963 4.25 8.34963H7.42773L11.4277 5.05568ZM8.32227 9.94435C8.16113 10.0771 7.95875 10.1504 7.75 10.1504H5.15039V13.8496H7.75C7.95875 13.8496 8.16113 13.923 8.32227 14.0557L11.0996 16.3428V7.65627L8.32227 9.94435Z'
      fill={color}
    />
  </Svg>
);
export default Volume;
