import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Clock = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M12 2.09961C17.4676 2.09961 21.9004 6.53238 21.9004 12C21.9004 17.4676 17.4676 21.9004 12 21.9004C6.53238 21.9004 2.09961 17.4676 2.09961 12C2.09961 6.53238 6.53238 2.09961 12 2.09961ZM12 3.90039C7.52649 3.90039 3.90039 7.52649 3.90039 12C3.90039 16.4735 7.52649 20.0996 12 20.0996C16.4735 20.0996 20.0996 16.4735 20.0996 12C20.0996 7.52649 16.4735 3.90039 12 3.90039ZM12 5.59961C12.4971 5.59961 12.9004 6.00294 12.9004 6.5V11.501L16.4766 13.7363C16.8979 13.9997 17.0267 14.5551 16.7637 14.9766C16.5003 15.3979 15.9449 15.5267 15.5234 15.2637L11.5234 12.7637C11.2603 12.5992 11.0996 12.3103 11.0996 12V6.5C11.0996 6.00294 11.5029 5.59961 12 5.59961Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </Svg>
);
export default Clock;
