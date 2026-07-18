import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Menu = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M20 16.7998C20.3866 16.7998 20.7002 17.1134 20.7002 17.5C20.7002 17.8866 20.3866 18.2002 20 18.2002H4C3.6134 18.2002 3.2998 17.8866 3.2998 17.5C3.2998 17.1134 3.6134 16.7998 4 16.7998H20ZM15.5 11.2998C15.8866 11.2998 16.2002 11.6134 16.2002 12C16.2002 12.3866 15.8866 12.7002 15.5 12.7002H4C3.6134 12.7002 3.2998 12.3866 3.2998 12C3.2998 11.6134 3.6134 11.2998 4 11.2998H15.5ZM20 5.7998C20.3866 5.7998 20.7002 6.1134 20.7002 6.5C20.7002 6.8866 20.3866 7.2002 20 7.2002H4C3.6134 7.2002 3.2998 6.8866 3.2998 6.5C3.2998 6.1134 3.6134 5.7998 4 5.7998H20Z'
      fill={color}
    />
  </Svg>
);
export default Menu;
