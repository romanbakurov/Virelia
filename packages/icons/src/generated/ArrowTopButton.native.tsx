import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const ArrowTopButton = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M6.69315 8.51525C6.38252 8.1181 6.45418 7.54563 6.85329 7.23649L11.4369 3.69195C11.7679 3.43599 12.2319 3.43605 12.5629 3.69195L17.1466 7.23649C17.5459 7.5456 17.6175 8.11802 17.3067 8.51525C16.9958 8.91211 16.42 8.98338 16.0206 8.67448L12.9171 6.2742V16.7258L16.0206 14.3256C16.4201 14.0166 16.9958 14.0878 17.3067 14.4848C17.6175 14.882 17.5459 15.4545 17.1466 15.7636L12.5629 19.3081C12.2319 19.5639 11.7679 19.564 11.4369 19.3081L6.85329 15.7636C6.45413 15.4545 6.38263 14.882 6.69315 14.4848C7.00401 14.0878 7.57978 14.0167 7.97931 14.3256L11.0828 16.7258V6.2742L7.97931 8.67448C7.57979 8.98323 7.00398 8.91222 6.69315 8.51525Z'
      fill={color}
    />
  </Svg>
);
export default ArrowTopButton;
