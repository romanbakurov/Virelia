import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const HeartFilled = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M15.3299 3.86936C16.8358 3.79359 18.3143 4.29237 19.4666 5.26487C20.6189 6.23762 21.3589 7.61213 21.5369 9.1096C21.7148 10.6071 21.3178 12.1165 20.4256 13.3323C20.3957 13.373 20.3623 13.4114 20.326 13.4465L12.6258 20.8967C12.2768 21.2343 11.7227 21.2343 11.3738 20.8967L3.67459 13.4465C3.63819 13.4113 3.60397 13.3731 3.574 13.3323C2.68185 12.1165 2.28474 10.607 2.46268 9.1096C2.64069 7.61211 3.38064 6.23763 4.53299 5.26487C5.68538 4.29216 7.16455 3.79348 8.67068 3.86936C9.88616 3.93064 11.0461 4.36292 11.9998 5.0969C12.9536 4.36277 14.1142 3.93061 15.3299 3.86936Z'
      fill={color}
    />
  </Svg>
);
export default HeartFilled;
