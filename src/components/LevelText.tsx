import React, { FunctionComponent, memo } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

import colors from 'assets/colors';

interface LevelTextProps {
  children: any;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  hidden?: boolean;
  style?: any;
}

const StyledText = styled.Text<LevelTextProps>`
  width: 100%;
  text-align: center;
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  font-family: ${props => props.fontFamily};
  ${props => props.hidden && 'display: none;'}
`;

const LevelText: FunctionComponent<LevelTextProps> = (props) => {
  const {
    color = colors.foreground,
    fontSize = 32,
    fontFamily = 'montserrat-bold',
    style,
    hidden,
    children
  } = props;
  return (
    <StyledText
      color={color}
      fontSize={fontSize}
      fontFamily={fontFamily}
      style={style}
      hidden={hidden}
    >
      {children}
    </StyledText>
  );
};

export default memo(LevelText);
