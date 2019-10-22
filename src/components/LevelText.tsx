import React, { FunctionComponent, memo } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

import colors from 'assets/colors';

interface LevelTextProps {
  children: string;
  color?: string;
  fontSize?: number;
  style?: any;
}

const StyledText = styled.Text<LevelTextProps>`
  width: 100%;
  text-align: center;
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  font-weight: bold;
`;

const LevelText: FunctionComponent<LevelTextProps> = (props) => {
  const color = props.color || colors.foreground;
  const fontSize = props.fontSize || 32;
  return (
    <StyledText
      color={color}
      fontSize={fontSize}
      style={props.style}
    >
      {props.children}
    </StyledText>
  );
};

export default memo(LevelText);
