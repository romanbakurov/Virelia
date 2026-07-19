import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const MoreHorizontal = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M5 10.6504C5.74553 10.6504 6.3496 11.2545 6.34961 12C6.34961 12.7456 5.74554 13.3496 5 13.3496C4.25442 13.3496 3.64941 12.7456 3.64941 12C3.64943 11.2544 4.25442 10.6504 5 10.6504ZM12 10.6504C12.7455 10.6504 13.3496 11.2545 13.3496 12C13.3496 12.7456 12.7455 13.3496 12 13.3496C11.2544 13.3496 10.6504 12.7456 10.6504 12C10.6504 11.2544 11.2544 10.6504 12 10.6504ZM19 10.6504C19.7455 10.6504 20.3496 11.2545 20.3496 12C20.3496 12.7456 19.7455 13.3496 19 13.3496C18.2544 13.3496 17.6504 12.7456 17.6504 12C17.6504 11.2544 18.2544 10.6504 19 10.6504Z'
      fill={color}
    />
  </Svg>
);
export default MoreHorizontal;
