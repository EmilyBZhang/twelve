import React, { FunctionComponent } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

import colors from '../assets/colors';

interface LevelCounterProps {
  count: number;
  color?: string;
  fontSize?: number;
  position?: {top?: number, bottom?: number, left?: number, right?: number};
}

interface CounterContainerProps {
  size: number;
}

interface CounterTextProps {
  color: string;
  fontSize: number;
}

const CounterContainer = styled.View<CounterContainerProps>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  justify-content: center;
  align-items: center;
`;

const CounterText = styled.Text<CounterTextProps>`
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  font-weight: 800;
  text-align: center;
`;

const defaultPosition = {bottom: 0, right: 0};

const LevelCounter: FunctionComponent<LevelCounterProps> = (props) => {
  const position = props.position || defaultPosition;
  const color = props.color || colors.coin;
  const fontSize = props.fontSize || 32;
  return (
    <CounterContainer
      style={{...position}}
      size={fontSize * 1.5}
    >
      <CounterText
        color={color}
        fontSize={fontSize}
      >
        {props.count}
      </CounterText>
    </CounterContainer>
  );
};

export default LevelCounter;
