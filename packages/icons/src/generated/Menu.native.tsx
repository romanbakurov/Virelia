import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Menu = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M20 16.5996C20.4971 16.5996 20.9004 17.0029 20.9004 17.5C20.9004 17.9971 20.4971 18.4004 20 18.4004H4C3.50294 18.4004 3.09961 17.9971 3.09961 17.5C3.09961 17.0029 3.50294 16.5996 4 16.5996H20ZM20 11.0996C20.4971 11.0996 20.9004 11.5029 20.9004 12C20.9004 12.4971 20.4971 12.9004 20 12.9004H4C3.50294 12.9004 3.09961 12.4971 3.09961 12C3.09961 11.5029 3.50294 11.0996 4 11.0996H20ZM20 5.59961C20.4971 5.59961 20.9004 6.00294 20.9004 6.5C20.9004 6.99706 20.4971 7.40039 20 7.40039H4C3.50294 7.40039 3.09961 6.99706 3.09961 6.5C3.09961 6.00294 3.50294 5.59961 4 5.59961H20Z'
      fill={color}
    />
  </Svg>
);
export default Menu;
