import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const DropdownMenu = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M5 10.2998C5.93888 10.2998 6.70019 11.0611 6.7002 12C6.7002 12.9389 5.93888 13.7002 5 13.7002C4.06112 13.7002 3.2998 12.9389 3.2998 12C3.29981 11.0611 4.06112 10.2998 5 10.2998ZM12 10.2998C12.9389 10.2998 13.7002 11.0611 13.7002 12C13.7002 12.9389 12.9389 13.7002 12 13.7002C11.0611 13.7002 10.2998 12.9389 10.2998 12C10.2998 11.0611 11.0611 10.2998 12 10.2998ZM19 10.2998C19.9389 10.2998 20.7002 11.0611 20.7002 12C20.7002 12.9389 19.9389 13.7002 19 13.7002C18.0611 13.7002 17.2998 12.9389 17.2998 12C17.2998 11.0611 18.0611 10.2998 19 10.2998Z'
      fill={color}
    />
  </Svg>
);
export default DropdownMenu;
