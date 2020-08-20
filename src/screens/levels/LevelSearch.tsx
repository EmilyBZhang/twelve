// TODO: Randomize coin locations and make the magnifying glass actually work

import React, { useState } from 'react';
import { Animated, View } from 'react-native';
import {
  State,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import styles from 'assets/styles';
import colors from 'assets/colors';
import { getLevelDimensions } from 'utils/getDimensions';
import { randCoinPosition } from 'utils/random';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { coinSize } = styles;

const lookingGlassSize = coinSize * 3;
const bounds = {
  min: {
    x: 0,
    y: 0,
  },
  max: {
    x: levelWidth - lookingGlassSize,
    y: levelHeight - lookingGlassSize,
  },
};

const initX = (bounds.min.x + bounds.max.x) / 2;
const initY = (bounds.min.y + bounds.max.y) / 2;

const LookingGlass = styled(Animated.View)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${lookingGlassSize}px;
  height: ${lookingGlassSize}px;
  z-index: -1;
  border-radius: ${lookingGlassSize / 2}px;
  background-color: ${colors.background};
`;

const calcBoundedX = (x: number) => {
  return Math.min(bounds.max.x, Math.max(bounds.min.x, x));
};

const calcBoundedY = (y: number) => {
  return Math.min(bounds.max.y, Math.max(bounds.min.y, y));
};

const LevelSearch: Level = (props) => {

  const [coinPositions] = useState(() => Array.from(Array(12), randCoinPosition));

  const [lastX, setLastX] = useState(initX);
  const [baseX] = useState(new Animated.Value(lastX));
  const [panX] = useState(new Animated.Value(0));
  
  const [lastY, setLastY] = useState(initY);
  const [baseY] = useState(new Animated.Value(lastY));
  const [panY] = useState(new Animated.Value(0));

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

  const translateX = Animated.diffClamp(
    Animated.add(baseX, panX), bounds.min.x, bounds.max.x
  );
  const translateY = Animated.diffClamp(
    Animated.add(baseY, panY), bounds.min.y, bounds.max.y
  );

  const handleGestureEvent = Animated.event(
    [{nativeEvent: {translationX: panX, translationY: panY}}]
  );

  const handleStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      changeX(lastX + e.nativeEvent.translationX);
      changeY(lastY + e.nativeEvent.translationY);
    }
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer color={colors.coin}>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <LookingGlass style={{
          transform: [{ translateX }, { translateY }]
        }} />
      </PanGestureHandler>
      <LevelCounter count={numCoinsFound} color={'white'} />
      {coinPositions.map((coinPosition, index: number) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            noShimmer
            colorHintOpacity={0}
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelSearch;
