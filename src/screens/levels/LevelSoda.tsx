import React, { useEffect, useState, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import {
  State,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { getLevelDimensions } from 'utils/getDimensions';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const threshold = levelWidth / 6;

const ColaImage = styled.Image.attrs({
  source: require('assets/images/cola.png'),
  resizeMode: 'contain',
})`
  width: ${levelWidth / 2};
  height: ${levelWidth * 5 / 6};
`;

enum Y {
  UP,
  DOWN,
  NEUTRAL,
}

const LevelSoda: Level = (props) => {

  const [baseY] = useState(new Animated.Value(0));
  const [panY] = useState(new Animated.Value(0));
  const [shake] = useState(new Animated.Value(0));
  const [shakeFactor] = useState(new Animated.Value(0));
  const [coinsRevealed, setCoinsRevealed] = useState(false);
  const numShakes = useRef(0);

  useEffect(() => {
    let direction = Y.NEUTRAL;
    let baseYVal = 0;
    baseY.addListener(({ value }) => { baseYVal = value; });
    panY.addListener(({ value }) => {
      if (numShakes.current >= 12 || value === 0) return;
      const y = baseYVal + value;
      if (y <= -threshold) {
        if (numShakes.current === 0) direction = Y.UP;
        if ((numShakes.current % 2 === 0) === (direction === Y.UP)) numShakes.current++;
      } else if (y >= threshold) {
        if (numShakes.current === 0) direction = Y.DOWN;
        if ((numShakes.current % 2 === 0) === (direction === Y.DOWN)) numShakes.current++;
      } else return;
      shakeFactor.setValue(numShakes.current / 6);
      if (numShakes.current >= 12) setCoinsRevealed(true);
    });
    return () => {
      baseY.removeAllListeners();
      panY.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shake, {
          toValue: 1,
          duration: 1000 / 24,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: -1,
          duration: 1000 / 24,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!coinsRevealed) return;
    Animated.timing(baseY, {
      toValue: threshold,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [coinsRevealed]);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY }}], { useNativeDriver: true }
  );

  const handleStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === State.END || e.nativeEvent.state === State.CANCELLED) {
      const { translationY } = e.nativeEvent;
      panY.setValue(0);
      baseY.setOffset(translationY);
      baseY.flattenOffset();
    }
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {/* {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))} */}
      <PanGestureHandler
        enabled={!coinsRevealed}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <Animated.View style={{ transform: [
          { translateY: Animated.add(baseY, panY) },
          { translateX: Animated.multiply(shake, shakeFactor) },
        ]}}>
          <ColaImage />
        </Animated.View>
      </PanGestureHandler>
    </LevelContainer>
  );
};

export default LevelSoda;
