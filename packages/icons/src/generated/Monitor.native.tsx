import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type IconProps = SvgProps & {
  size?: number | string;
  color?: string;
};
const Monitor = ({
  size = 16,
  color = 'currentColor',
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill={color} {...props}>
    <Path
      d='M18.75 2.84961C20.6278 2.84961 22.1504 4.37223 22.1504 6.25V14.75C22.1504 16.6278 20.6278 18.1504 18.75 18.1504H12.9004V19.3496H15.75C16.2471 19.3496 16.6504 19.7529 16.6504 20.25C16.6504 20.7471 16.2471 21.1504 15.75 21.1504H8.25C7.75294 21.1504 7.34961 20.7471 7.34961 20.25C7.34961 19.7529 7.75294 19.3496 8.25 19.3496H11.0996V18.1504H5.25C3.37223 18.1504 1.84961 16.6278 1.84961 14.75V6.25C1.84961 4.37223 3.37223 2.84961 5.25 2.84961H18.75ZM5.25 4.65039C4.36634 4.65039 3.65039 5.36634 3.65039 6.25V14.75C3.65039 15.6337 4.36634 16.3496 5.25 16.3496H18.75C19.6337 16.3496 20.3496 15.6337 20.3496 14.75V6.25C20.3496 5.36634 19.6337 4.65039 18.75 4.65039H5.25Z'
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
    />
  </Svg>
);
export default Monitor;
