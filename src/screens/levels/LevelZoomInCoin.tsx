import React, { useRef, useEffect, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import styled from 'styled-components/native';
import {
  PinchGestureHandler,
  PinchGestureHandlerStateChangeEvent,
  State
} from 'react-native-gesture-handler';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const Container = styled(Animated.View)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const minScale = 2 / levelWidth;
const maxScale = 1;

const calcBoundedScale = (scale: number) => {
  return Math.min(maxScale, Math.max(minScale, scale));
};

const initScale = styles.coinSize / levelWidth;
const pressScaleFactor = 2;

const LevelZoomInCoin: Level = (props) => {
  const [lastScale, setLastScale] = useState(initScale);
  const [baseScale] = useState(new Animated.Value(lastScale));
  const [pinchScale] = useState(new Animated.Value(1));

  const scale = Animated.multiply(baseScale, pinchScale).interpolate({
    inputRange: [0, minScale, maxScale, maxScale + 1],
    outputRange: [minScale, minScale, maxScale, maxScale]
  });

  const handlePinchGestureEvent = Animated.event(
    [{nativeEvent: {scale: pinchScale}}],
    { useNativeDriver: true },
  );

  const changeScale = (newScale: number) => {
    const newLastScale = calcBoundedScale(newScale);
    baseScale.setValue(newLastScale);
    pinchScale.setValue(1);
    setLastScale(newLastScale);
  };

  const handlePinchHandlerStateChange = (e: PinchGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      changeScale(lastScale * e.nativeEvent.scale);
    }
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  const handleCoinPress = () => {
    changeScale(lastScale / pressScaleFactor);
    props.onCoinPress(numCoinsFound);
  };

  return (
    <LevelContainer>
      <PinchGestureHandler
        onGestureEvent={handlePinchGestureEvent}
        onHandlerStateChange={handlePinchHandlerStateChange}
      >
        <Container>
          <LevelCounter count={numCoinsFound} />
          <Animated.View style={{
            transform: [{scaleX: scale}, {scaleY: scale}]
          }}>
            <Coin
              size={levelWidth}
              found={twelve}
              onPress={handleCoinPress}
            />
          </Animated.View>
        </Container>
      </PinchGestureHandler>
    </LevelContainer>
  );
};

export default LevelZoomInCoin;
