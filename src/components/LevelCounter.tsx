import React, { FunctionComponent, memo } from 'react';
import styled from 'styled-components/native';

import colors from 'assets/colors';

interface LevelCounterProps {
  count: number;
  color?: string;
  fontSize?: number;
  position?: {top?: number, bottom?: number, left?: number, right?: number};
  width?: number;
  height?: number;
  textStyle?: any;
}

interface CounterContainerProps {
  width: number;
  height: number;
}

interface CounterTextProps {
  color: string;
  fontSize: number;
}

const CounterContainer = styled.View<CounterContainerProps>`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  justify-content: center;
  align-items: center;
`;

const CounterText = styled.Text<CounterTextProps>`
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  font-weight: 800;
  text-align: center;
  width: 100%;
`;

const defaultPosition = {bottom: 0, right: 0};

const LevelCounter: FunctionComponent<LevelCounterProps> = (props) => {
  const {
    position = defaultPosition,
    color = colors.coin,
    fontSize = 32,
    count,
    textStyle
  } = props;
  const width = props.width || fontSize * 1.5;
  const height = props.height || fontSize * 1.5;
  return (
    <CounterContainer
      style={{...position}}
      width={width}
      height={height}
    >
      <CounterText
        color={color}
        fontSize={fontSize}
        style={textStyle}
      >
        {(count >= 0) ? String(count) : '?'}
      </CounterText>
    </CounterContainer>
  );
};

export default memo(LevelCounter);
