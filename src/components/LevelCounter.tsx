import React, { FunctionComponent, memo } from 'react';
import styled from 'styled-components/native';

import colors from 'assets/colors';
import styles from 'assets/styles';

interface LevelCounterProps {
  count: number;
  color?: string;
  fontSize?: number;
  position?: {top?: number, bottom?: number, left?: number, right?: number};
  zIndex?: number;
  width?: number;
  height?: number;
  textStyle?: any;
}

interface CounterContainerProps {
  width: number;
  height: number;
  zIndex: number;
}

interface CounterTextProps {
  color: string;
  fontSize: number;
}

const CounterContainer = styled.View<CounterContainerProps>`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  z-index: ${props => props.zIndex};
  justify-content: center;
  align-items: center;
`;

const CounterText = styled.Text<CounterTextProps>`
  color: ${props => props.color};
  font-size: ${props => props.fontSize}px;
  font-family: montserrat-bold;
  text-align: center;
  width: 100%;
`;

const defaultPosition = {bottom: 0, right: 0};

const LevelCounter: FunctionComponent<LevelCounterProps> = (props) => {
  const {
    position = defaultPosition,
    color = colors.coin,
    fontSize = styles.levelTextSize,
    zIndex = 0,
    count,
    textStyle
  } = props;
  const width = props.width || fontSize * 1.5;
  const height = props.height || fontSize * 1.5;
  return (
    <CounterContainer
      pointerEvents={'none'}
      style={{...position}}
      width={width}
      height={height}
      zIndex={zIndex}
    >
      <CounterText
        color={color}
        fontSize={fontSize}
        style={textStyle}
      >
        {count}
      </CounterText>
    </CounterContainer>
  );
};

export default memo(LevelCounter);
