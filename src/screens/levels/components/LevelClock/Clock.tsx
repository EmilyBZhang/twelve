import React, { FunctionComponent, memo, useState, useEffect, useMemo } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';

import colors from 'assets/colors';
import { getLevelDimensions } from 'utils/getDimensions';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

export const clockSize = levelWidth * 3 / 4;
export const clockBorderWidth = 4;
export const clockRadius = clockSize / 2 - clockBorderWidth;

const secondHandDims = {width: 2, height: clockRadius};
const minuteHandDims = {width: 4, height: clockRadius * 11 / 12};
const hourHandDims = {width: 4, height: clockRadius * 7 / 12};
const smallTickDims = {width: 2, height: clockRadius};
const largeTickDims = {width: 6, height: clockRadius};

interface Dims {
  width: number;
  height: number;
}

interface BodyProps {
  color: string;
}

const HandContainer = styled(Animated.View)<Dims>`
  position: absolute;
  top: ${props => clockRadius - props.height}px;
  left: ${props => clockRadius - props.width / 2}px;
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

const timeCycles = {
  second: 60 * 1000,
  minute: 60 * 60 * 1000,
  hour: 12 * 60 * 60 * 1000
} as {[unit: string]: number};

const timeProps = {
  second: [secondHandDims, colors.badCoin],
  minute: [minuteHandDims, 'black'],
  hour: [hourHandDims, 'black'],
} as {[unit: string]: [Dims, string]};

const msPerCycle = timeCycles.hour;

interface ClockHandProps {
  type: 'second' | 'minute' | 'hour';
  ms: any;
}

const ClockHand: FunctionComponent<ClockHandProps> = memo((props) => {
  const [dims, color] = timeProps[props.type];

  const cycle = timeCycles[props.type];
  const rotation = Animated.modulo(props.ms, cycle);

  const deg = rotation.interpolate({
    inputRange: [0, cycle],
    outputRange: ['0deg', '360deg']
  });

  return (
    <HandContainer
      {...dims}
      style={{
        transform: [{rotate: deg}]
      }}
    >
      <HandBody color={color} />
    </HandContainer>
  );
});

const clockCenterRadius = clockSize / 24;

const ClockCenter = styled.View`
  position: absolute;
  top: ${clockRadius - clockCenterRadius}px;
  left: ${clockRadius - clockCenterRadius}px;
  width: ${clockCenterRadius * 2}px;
  height: ${clockCenterRadius * 2}px;
  background-color: black;
  border-radius: ${clockCenterRadius}px;
`;

interface ClockTickProps {
  index: number
}

const TickBody = styled.View`
  width: 100%;
  height: ${100 / 15}%;
  background-color: black;
`;

const ClockTick: FunctionComponent<ClockTickProps> = (props) => {
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
};

const ClockContainer = styled.View`
  width: ${clockSize}px;
  height: ${clockSize}px;
  border: ${clockBorderWidth}px solid black;
  border-radius: ${clockSize / 2}px;
  background-color: #f0f0f0;
  justify-content: center;
  align-items: center;
`;

interface ClockProps {
  children?: any;
}

const Clock: FunctionComponent<ClockProps> = (props) => {
  const msElapsed = useMemo(() => {
    const currDate = new Date();
    const midnight = new Date(currDate);
    midnight.setHours(0, 0, 0, 0);
    return currDate.getTime() - midnight.getTime();
  }, []);
  const [msAnim] = useState(new Animated.Value(msElapsed));

  useEffect(() => {
    Animated.loop(
      Animated.timing(msAnim, {
        toValue: msElapsed + msPerCycle,
        duration: msPerCycle,
        easing: Easing.linear
      })
    ).start();
  }, []);

  return (
    <ClockContainer>
      {Array.from(
        Array(60),
        (_, index) => <ClockTick key={String(index)} index={index} />
      )}
      <ClockHand type={'hour'} ms={msAnim} />
      <ClockHand type={'minute'} ms={msAnim} />
      <ClockHand type={'second'} ms={msAnim} />
      <ClockCenter />
      {props.children}
    </ClockContainer>
  );
};

export default memo(Clock);
