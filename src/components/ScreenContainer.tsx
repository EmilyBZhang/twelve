import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import colors from '../assets/colors';

interface ScreenContainerProps {
  children?: any;
  color?: string;
  style?: any;
}

const Container = styled.View<ScreenContainerProps>`
  flex: 1;
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
`

const ScreenContainer: FunctionComponent<ScreenContainerProps> = (props) => {
  const color = props.color || colors.background;
  return <Container color={color} style={props.style}>{props.children}</Container>;
}

export default ScreenContainer;
