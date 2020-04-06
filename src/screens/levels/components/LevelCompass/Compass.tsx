import React, { FunctionComponent, memo, useState, useEffect, useMemo } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';

import colors from 'assets/colors';
import { getLevelDimensions } from 'utils/getDimensions';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

export const compassSize = levelWidth;
export const compassBorderWidth = 4;
export const compassRadius = compassSize / 2 - compassBorderWidth;

const compassHandDims = {width: 2, height: compassRadius};
const smallTickDims = {width: 2, height: compassRadius};
const largeTickDims = {width: 6, height: compassRadius};

interface Dims {
  width: number;
  height: number;
}

interface BodyProps {
  color: string;
}

const HandContainer = styled(Animated.View)<Dims>`
  position: absolute;
  top: ${props => compassRadius - props.height}px;
  left: ${props => compassRadius - props.width / 2}px;
  width: ${props => props.width}px;
  height: ${props => props.height * 2}px;
  background-color: transparent;
  ${props => props.rotate ? `transform: rotate(${props.rotate}deg);` : ''}
`;

const HandBody = styled.View<BodyProps>`
  width: 100%;
  height: 50%;
  background-color: ${props => props.color};
`;

interface CompassHandProps {
  rotation: Animated.AnimatedInterpolation;
}

const CompassHand: FunctionComponent<CompassHandProps> = memo((props) => {

  const { rotation } = props;

  return (
    <HandContainer
      {...compassHandDims}
      style={{
        transform: [{rotate: rotation}]
      }}
    >
      <HandBody color={'pink'} />
    </HandContainer>
  );
});

const compassCenterRadius = compassSize / 24;

const CompassCenter = styled.View`
  position: absolute;
  top: ${compassRadius - compassCenterRadius}px;
  left: ${compassRadius - compassCenterRadius}px;
  width: ${compassCenterRadius * 2}px;
  height: ${compassCenterRadius * 2}px;
  background-color: black;
  border-radius: ${compassCenterRadius}px;
`;

interface CompassTickProps {
  index: number
}

const TickBody = styled.View`
  width: 100%;
  height: ${100 / 15}%;
  background-color: black;
`;

const CompassTick: FunctionComponent<CompassTickProps> = memo((props) => {
  const { index } = props;
  const dims = (index % 5) ? smallTickDims : largeTickDims;

  return (
    <HandContainer
      {...dims}
      rotate={index * 6}
    >
      <TickBody />
    </HandContainer>
  );
});

const CompassContainer = styled.View`
  width: ${compassSize}px;
  height: ${compassSize}px;
  border: ${compassBorderWidth}px solid black;
  border-radius: ${compassSize / 2}px;
  background-color: #f0f0f0;
  justify-content: center;
  align-items: center;
`;

interface CompassProps {
  rotation: Animated.AnimatedInterpolation;
  children?: any;
}

const Compass: FunctionComponent<CompassProps> = (props) => {

  return (
    <CompassContainer>
      {Array.from(
        Array(60),
        (_, index) => <CompassTick key={String(index)} index={index} />
      )}
      <CompassHand rotation={props.rotation} />
      <CompassCenter />
      {props.children}
    </CompassContainer>
  );
};

export default memo(Compass);
