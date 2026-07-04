import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Plus = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg viewBox='0 0 20 20' fill={color} width={size} height={size} {...props}>
    <Path
      d='M10 2C10.5198 2 10.9412 2.42138 10.9412 2.94117L10.9412 9.05879H17.0588C17.5786 9.05879 18 9.48016 18 9.99996C18 10.5198 17.5786 10.9411 17.0588 10.9411H10.9412L10.9412 17.0588C10.9412 17.5786 10.5198 18 10 18C9.4802 18 9.05882 17.5786 9.05882 17.0588L9.05788 10.9411H2.94118C2.42138 10.9411 2 10.5198 2 9.99996C2 9.48016 2.42138 9.05879 2.94118 9.05879H9.05788L9.05882 2.94117C9.05882 2.42138 9.4802 2 10 2Z'
      fill={color}
    />
  </Svg>
);
export default Plus;
