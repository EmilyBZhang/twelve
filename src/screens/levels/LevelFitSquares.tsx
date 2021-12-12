// TODO: Fix all the squareSize nonsense (in addition to the scale nonsense)

import React, { useRef, useEffect, useState } from 'react';
import { Animated, Easing, View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  PinchGestureHandler,
  PinchGestureHandlerStateChangeEvent,
  RotationGestureHandler,
  RotationGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';

import useSelectedIndices from 'hooks/useSelectedIndices';
import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import FullyConnectedGrid, { RevealedSquareProps } from './components/LevelFitSquares/FullyConnectedGrid';
import squares from './components/LevelFitSquares/squares';
import playAudio from 'utils/playAudio';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const squareSize = levelWidth / 2;
const xBound = (levelWidth - squareSize) / 2;
const yBound = (levelHeight - squareSize) / 2;

const panTolerance = 1 / 12;
const rotationTolerance = Math.PI / 24;
const scaleTolerance = 13 / 12;
const isWithinMargin = (testSquare: RevealedSquareProps, baseSquare: RevealedSquareProps) => {
  const { x: testX, y: testY, scale: testScale } = testSquare;
  const { x: baseX, y: baseY, rotation: baseRotation, scale: baseScale } = baseSquare;
  const testRotation = testSquare.rotation % (Math.PI / 2);
  const rotationDelta = Math.min(
    Math.abs(baseRotation - testRotation - Math.PI / 2),
    Math.abs(baseRotation - testRotation),
    Math.abs(baseRotation - testRotation + Math.PI / 2),
  );
  return (
    Math.abs(testX - baseX) <= panTolerance &&
    Math.abs(testY - baseY) <= panTolerance &&
    rotationDelta <= rotationTolerance &&
    Math.max(testScale / baseScale, baseScale / testScale) <= scaleTolerance
  );
};

const CoinContainer = styled.View`
  position: absolute;
  z-index: 1;
`;

const Container = styled(Animated.View)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  /* background-color: #ff80ff; */
`;

const SquareContainer = styled(Animated.View)`
  position: absolute;
  top: -${squareSize}px;
  left: -${squareSize}px;
`;

const Square = styled.View`
  width: ${levelWidth}px;
  height: ${levelWidth}px;
  /* background-color: rgb(241, 84, 91); */
  background-color: #ea0099; /*${colors.coin};*/
  opacity: 0.5;
`;

const FlashSquare = styled(Animated.View)`
  position: absolute;
  width: ${levelWidth}px;
  height: ${levelWidth}px;
  z-index: 1;
  background-color: white;
`;

const minScale = 2 / levelWidth;
const maxScale = 1;

const calcBoundedX = (x: number) => {
  return Math.min(levelWidth, Math.max(0, x));
};

const calcBoundedY = (y: number) => {
  return Math.min(levelHeight, Math.max(0, y));
};

const calcBoundedScale = (scale: number) => {
  return Math.min(maxScale, Math.max(minScale, scale));
};

const initX = squareSize / 2;
const initY = squareSize / 2;
const initScale = 1;

const AlignedContainer = styled.View`
  height: ${levelHeight}px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const LevelFitSquares: Level = (props) => {
  const [squaresRevealed, toggleSquareIndex] = useSelectedIndices();

  const [squareFlash] = useState(new Animated.Value(0));

  const [lastX, setLastX] = useState(initX);
  const [baseX] = useState(new Animated.Value(lastX));
  const [panX] = useState(new Animated.Value(0));
  
  const [lastY, setLastY] = useState(initY);
  const [baseY] = useState(new Animated.Value(lastY));
  const [panY] = useState(new Animated.Value(0));

  const [lastScale, setLastScale] = useState(initScale);
  const [baseScale] = useState(new Animated.Value(lastScale));
  const [pinchScale] = useState(new Animated.Value(1));
  
  const [lastRotation, setLastRotation] = useState(0);
  const [baseRotation] = useState(new Animated.Value(lastRotation));
  const [rotationRad] = useState(new Animated.Value(0));

  const panRef = useRef<PanGestureHandler | null>(null);
  const pinchRef = useRef<PinchGestureHandler | null>(null);
  const rotationRef = useRef<RotationGestureHandler | null>(null);

  const translateX = Animated.diffClamp(Animated.add(baseX, panX), 0, levelWidth);
  const translateY = Animated.diffClamp(Animated.add(baseY, panY), 0, levelHeight);

  const flashSquare = () => {
    squareFlash.setValue(0.5);
    Animated.timing(squareFlash, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const scale = Animated.diffClamp(
    Animated.divide(Animated.multiply(baseScale, pinchScale), 2),
    minScale,
    maxScale
  );

  const rotation = Animated.add(baseRotation, rotationRad).interpolate({
    inputRange: [0, 1],
    outputRange: ['0rad', '1rad']
  });

  const changeX = (newX: number) => {
    const newLastX = calcBoundedX(newX);
    baseX.setValue(newLastX);
    panX.setValue(0);
    setLastX(newLastX);
    return newLastX;
  };

  const changeY = (newY: number) => {
    const newLastY = calcBoundedY(newY);
    baseY.setValue(newLastY);
    panY.setValue(0);
    setLastY(newLastY);
    return newLastY;
  };

  const changeScale = (newScale: number) => {
    const newLastScale = calcBoundedScale(newScale);
    baseScale.setValue(newLastScale);
    pinchScale.setValue(1);
    setLastScale(newLastScale);
    return newLastScale;
  };

  const changeRotation = (newRotation: number) => {
    baseRotation.setValue(newRotation);
    rotationRad.setValue(0);
    setLastRotation(newRotation);
    return newRotation;
  };

  const handlePanGestureEvent = Animated.event(
    [{nativeEvent: {translationX: panX, translationY: panY}}],
    { useNativeDriver: false },
  );

  const handlePanGestureStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      changeX(lastX + e.nativeEvent.translationX);
      changeY(lastY + e.nativeEvent.translationY);
    }
  };

  const handlePinchGestureEvent = Animated.event(
    [{nativeEvent: {scale: pinchScale}}],
    { useNativeDriver: false },
  );

  const handlePinchHandlerStateChange = (e: PinchGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      const finalScale = changeScale(lastScale * e.nativeEvent.scale);
    }
  };

  const handleRotationGestureEvent = Animated.event(
    [{nativeEvent: {rotation: rotationRad}}],
    { useNativeDriver: false },
  );

  const handleRotationHandlerStateChange = (e: RotationGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      const finalRotation = changeRotation(lastRotation + e.nativeEvent.rotation);
    }
  };

  const numCoinsFound = props.coinsFound.size;

  squares.forEach((square, index) => {
    if (squaresRevealed.has(index)) return;
    const currentSquare = {
      x: (lastX - (squareSize * lastScale) / 2 - xBound) / (squareSize),
      y: (lastY - (squareSize * lastScale) / 2 - yBound) / (squareSize),
      scale: lastScale,
      rotation: lastRotation
    };
    // TODO: Currently implemented w/ race condition, fix this
    if (isWithinMargin(currentSquare, square)) {
      playAudio(require('assets/sfx/success.wav'), undefined, { volume: 1/6 });
      toggleSquareIndex(index);
      setTimeout(() => {
        flashSquare();
        changeX(square.x * (squareSize) + (squareSize * square.scale) / 2 + xBound);
        changeY(square.y * (squareSize) + (squareSize * square.scale) / 2 + yBound);
        changeScale(square.scale);
        changeRotation(square.rotation);
      }, 1000 / 12);
    }
  });

  const revealedSquares = squares.filter((_, index) => squaresRevealed.has(index));

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <AlignedContainer>
        <FullyConnectedGrid
          revealedSquares={revealedSquares}
        />
        {Array.from(Array(12), (_, index) => (
          squaresRevealed.has(index) && !props.coinsFound.has(index) && (
            <CoinContainer key={String(index)}>
              <Coin
                onPress={() => props.onCoinPress(index)}
              />
            </CoinContainer>
          )
        ))}
        <PanGestureHandler
          ref={panRef}
          onGestureEvent={handlePanGestureEvent}
          onHandlerStateChange={handlePanGestureStateChange}
          simultaneousHandlers={[rotationRef, pinchRef]}
        >
        <PinchGestureHandler
          ref={pinchRef}
          onGestureEvent={handlePinchGestureEvent}
          onHandlerStateChange={handlePinchHandlerStateChange}
          simultaneousHandlers={[panRef, rotationRef]}
        >
        <RotationGestureHandler
          ref={rotationRef}
          onGestureEvent={handleRotationGestureEvent}
          onHandlerStateChange={handleRotationHandlerStateChange}
          simultaneousHandlers={[panRef, pinchRef]}
        >
          <Container>
            <SquareContainer style={{
              transform: [
                {translateX},
                {translateY},
                {scaleX: scale},
                {scaleY: scale},
                {rotate: rotation},
              ]
            }}>
              <Square />
              <FlashSquare style={{opacity: squareFlash}} />
            </SquareContainer>
          </Container>
        </RotationGestureHandler>
        </PinchGestureHandler>
        </PanGestureHandler>
      </AlignedContainer>
    </LevelContainer>
  );
};

export default LevelFitSquares;
