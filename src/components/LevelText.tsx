import React, { FunctionComponent } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

import colors from '../assets/colors';

interface LevelTextProps {
  children: string;
  color?: string;
  fontSize?: number;
}

const StyledText = styled.Text<LevelTextProps>`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
`;

const LevelText: FunctionComponent<LevelTextProps> = (props) => {
  const color = props.color || colors.foreground;
  const fontSize = props.fontSize || 32;
  return (
    <StyledText
      color={color}
      fontSize={fontSize}
    >
      {props.children}
    </StyledText>
  );
};

export default LevelText;
