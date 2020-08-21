// TODO: Consider moving LinearGradient to LevelContainer to capture the top bar

import React, { FunctionComponent, memo } from 'react';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

import colors from 'assets/colors';

export interface ScreenContainerProps {
  children?: any;
  color?: string;
  style?: any;
  gradientColors?: Array<string>;
}

// TODO: See if SafeAreaView works on devices with notches
const Container = styled.View<ScreenContainerProps>`
  flex: 1;
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
`

const GradientContainer = styled(LinearGradient)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ScreenContainer: FunctionComponent<ScreenContainerProps> = (props) => {
  let color = props.color || colors.background;
  let children = props.children;
  if (props.gradientColors) {
    color = 'transparent';
    children = (
      <GradientContainer
        colors={props.gradientColors}
        style={props.style}
      >
        {props.children}
      </GradientContainer>
    );
  }
  return (
    <Container
      color={color}
      style={props.style}
    >
      {children}
    </Container>
  );
}

export default memo(ScreenContainer);
