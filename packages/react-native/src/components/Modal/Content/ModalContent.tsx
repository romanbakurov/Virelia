import { Animated } from 'react-native';

import { useThemeStyles } from '../../../theme';
import { useModalContext } from '../internal/ModalContext';

import { createStyles } from './ModalContent.styles';
import type { ModalContentProps } from './types';

export const ModalContent = ({ children, style }: ModalContentProps) => {
  const styles = useThemeStyles(createStyles);
  const { animation, animationProgress, open } = useModalContext();
  const closedTranslateY = open ? (animation === 'slide' ? 16 : 8) : 4;
  const closedScale = open ? 0.96 : 0.98;
  const animatedStyle =
    animation === 'none'
      ? undefined
      : {
          opacity: animationProgress,
          transform:
            animation === 'fade'
              ? []
              : [
                  {
                    translateY: animationProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [closedTranslateY, 0],
                    }),
                  },
                  ...(animation === 'scale'
                    ? [
                        {
                          scale: animationProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [closedScale, 1],
                          }),
                        },
                      ]
                    : []),
                ],
        };

  return (
    <Animated.View style={[styles.content, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

ModalContent.displayName = 'ModalContent';
