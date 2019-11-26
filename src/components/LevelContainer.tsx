import React, { FunctionComponent, memo } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

import colors from 'assets/colors';
import styles from 'assets/styles';
import ScreenContainer, { ScreenContainerProps } from 'components/ScreenContainer';
import getDimensions from 'utils/getDimensions';

const { width: windowWidth, height: windowHeight } = getDimensions();

interface LevelContainerProps extends ScreenContainerProps {
  transparentBuffer?: boolean;
}

const Buffer = styled.View<LevelContainerProps>`
  background-color: ${
    props => props.transparentBuffer ? 'transparent' : props.color
  };
  width: ${windowWidth}px;
  height: ${styles.levelNavHeight}px;
`

const LevelContainer: FunctionComponent<LevelContainerProps> = (props) => {
  const {
    gradientColors,
    style,
    children,
    transparentBuffer
  } = props;

  const bufferColor = props.color || (
    (gradientColors && gradientColors[0]) || colors.background
  );

  return (<>
    <Buffer
      color={bufferColor}
      transparentBuffer={transparentBuffer}
    />
    <ScreenContainer
      color={props.color}
      gradientColors={gradientColors}
      style={style}
    >
      {children}
    </ScreenContainer>
  </>);
}

export default memo(LevelContainer);
