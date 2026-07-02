import { Children, cloneElement, isValidElement } from 'react';

import type { ReactElement, ReactNode } from 'react';
import type { TextProps } from 'react-native';
import { Text, View } from 'react-native';

import { useThemeStyles } from '../../../theme';

import { createStyles } from './ModalBody.styles';
import type { ModalBodyProps } from './types';

const isTextElement = (child: ReactNode): child is ReactElement<TextProps> =>
  isValidElement(child) && child.type === Text;

const renderBodyChildren = (
  children: ReactNode,
  textStyle: TextProps['style']
): ReactNode =>
  Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <Text style={textStyle}>{child}</Text>;
    }

    if (!isTextElement(child)) {
      return child;
    }

    return cloneElement(child, {
      style: [textStyle, child.props.style],
    });
  });

export const ModalBody = ({ children, style }: ModalBodyProps) => {
  const styles = useThemeStyles(createStyles);

  return (
    <View style={[styles.body, style]}>
      {renderBodyChildren(children, styles.text)}
    </View>
  );
};

ModalBody.displayName = 'ModalBody';
