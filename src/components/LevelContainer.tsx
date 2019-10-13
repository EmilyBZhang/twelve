// TODO: Make a useDimension hook or util to compensate for the adjusted screen height

import React, { FunctionComponent } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

import colors from 'assets/colors';
import styles from 'assets/styles';
import ScreenContainer from 'components/ScreenContainer';
import getDimensions from 'utils/getDimensions';

const { width: windowWidth, height: windowHeight } = getDimensions();

interface LevelContainerProps {
  children?: any;
  color?: string;
  style?: any;
}

const Buffer = styled.View<LevelContainerProps>`
  background-color: ${props => props.color};
  width: ${windowWidth}px;
  height: ${styles.levelNavHeight}px;
`

const LevelContainer: FunctionComponent<LevelContainerProps> = (props) => {
  const color = props.color || colors.background;
  return (
    <>
      <Buffer color={color}></Buffer>
      <ScreenContainer color={props.color} style={props.style}>
        {props.children}
      </ScreenContainer>
    </>
  );
}

export default LevelContainer;
