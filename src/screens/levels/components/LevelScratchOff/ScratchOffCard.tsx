import React, { FunctionComponent, memo, useMemo, useRef } from 'react';
import { PanResponder, GestureResponderEvent } from 'react-native';
import styled from 'styled-components/native';
import { observable, computed, autorun, IComputedValue } from 'mobx';
import { observer } from 'mobx-react';

import getDimensions from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';

const { width: windowWidth, height: windowHeight } = getDimensions();
const particleSize = styles.coinSize;
const particleCols = Math.ceil(windowWidth / particleSize);
const particleRows = Math.ceil(windowHeight / particleSize);
const numParticles = particleRows * particleCols;

interface ScratchOffCardProps {}

interface ParticleProps {
  index: number;
  hidden: IComputedValue<boolean>;
}

interface ParticleViewProps {
  index: number;
  hidden: boolean;
}

const ScratchOffCardContainer = styled.View.attrs({
  pointerEvents: 'box-none'
})`
  position: absolute;
  top: 0px;
  left: 0px;
`;

const calcIndex = (x: number, y: number) => {
  const r = Math.floor(y / particleSize);
  const c = Math.floor(x / particleSize);
  return r * particleCols + c;
};
const calcXY = (index: number, yOffset = -styles.levelNavHeight) => {
  const x = (index % particleCols) * particleSize;
  const y = Math.floor(index / particleCols) * particleSize + yOffset;
  return {x, y};
};

const ParticleView = styled.View<ParticleViewProps>`
  position: absolute;
  ${props => {
    const { x, y } = calcXY(props.index);
    return `top: ${y}px; left: ${x}px;`
  }}
  width: ${particleSize}px;
  height: ${particleSize}px;
  background-color: ${colors.coin};
  z-index: 144;
  ${props => props.hidden && 'display: none;'}
`;

const Particle: FunctionComponent<ParticleProps> = observer((props) => {
  return (
    <ParticleView
      index={props.index}
      hidden={props.hidden.get()}
    />
  );
});

// const squareOffsets = [
//   // -particleCols - 1,
//   -particleCols,
//   // -particleCols + 1,
//   -1, 0, 1,
//   // particleCols - 1,
//   particleCols,
//   // particleCols + 1
// ];

const ScratchOffCard: FunctionComponent<ScratchOffCardProps> = (props) => {
  const initParticlesHidden = useMemo(
    () => Array<boolean>(numParticles).fill(false),
    []
  );
  const particlesHidden = observable(useRef(initParticlesHidden).current);

  const handleCardGrantOrMove = (e: GestureResponderEvent) => {
    const { pageX: x, pageY: y } = e.nativeEvent;
    const index = calcIndex(x, y);
    if (index >= 0 && index < particlesHidden.length) {
      particlesHidden[index] = true;
    }
    // squareOffsets.forEach((offset) => {
    //   const i = index + offset;
    //   if (i >= 0 && i < particlesHidden.length) {
    //     particlesHidden[i] = true;
    //   }
    // });
  };

  // TODO: Maybe allow pan responder to begin when a non-particle is pressed
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => true,
    onStartShouldSetPanResponderCapture: (e, gestureState) => true,
    onMoveShouldSetPanResponder: (e, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
    onPanResponderTerminationRequest: (e, gestureState) => true,
    onShouldBlockNativeResponder: (evt, gestureState) => true,
    onPanResponderGrant: handleCardGrantOrMove,
    onPanResponderMove: handleCardGrantOrMove,
    onPanResponderRelease: (e, gestureState) => {
    },
    onPanResponderTerminate: (e, gestureState) => {
    },
  }), []);

  return (
    <ScratchOffCardContainer
      {...panResponder.panHandlers}
    >
      {Array.from(Array(numParticles), (_, index) => (
        <Particle
          key={String(index)}
          index={index}
          hidden={computed(() => particlesHidden[index])}
        />
      ))}
    </ScratchOffCardContainer>
  );
};

export default memo(ScratchOffCard);
