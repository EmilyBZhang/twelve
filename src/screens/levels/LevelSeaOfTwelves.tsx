// IDEA: Drag away 'twelve' LevelTexts to reveal coins underneath

import React, { FunctionComponent, memo, useState, useRef, useCallback } from 'react';
import { Animated, View } from 'react-native';
import {
  PanGestureHandler, PanGestureHandlerStateChangeEvent, State,
} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const gridWidth = levelWidth * 1.25;

const numCols = 4;
const numRows = Math.ceil(10 * levelHeight / levelWidth);
const numTwelves = numCols * numRows;

const TwelveGrid = styled.View.attrs({
  pointerEvents: 'box-none',
})`
  flex-direction: row;
  flex-wrap: wrap;
  width: ${gridWidth}px;
  position: absolute;
`;

const TwelveText = styled(Animated.Text).attrs({
  children: 'twelve',
})`
  z-index: 1;
  text-align: center;
  color: ${colors.foreground};
  background-color: ${colors.background};
  font-size: ${styles.levelTextSize}px;
  font-family: montserrat-bold;
`;

const Twelve: FunctionComponent = memo(() => {
  const [active, setActive] = useState(false);
  const [baseX] = useState(new Animated.Value(0));
  const [baseY] = useState(new Animated.Value(0));
  const [panX] = useState(new Animated.Value(0));
  const [panY] = useState(new Animated.Value(0));

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: panX, translationY: panY }}],
    { useNativeDriver: true }
  );

  const handleStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === State.END) {
      const { translationX, translationY } = e.nativeEvent;
      panX.setValue(0);
      baseX.setOffset(translationX);
      baseX.flattenOffset();
      panY.setValue(0);
      baseY.setOffset(translationY);
      baseY.flattenOffset();
      setActive(false);
    } else if (e.nativeEvent.state === State.BEGAN) {
      setActive(true);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleStateChange}>
      <TwelveText style={{
        transform: [
          { translateX: Animated.add(baseX, panX) },
          { translateY: Animated.add(baseY, panY) },
          { scale: active ? 13/12 : 1 }
        ],
        zIndex: active ? 2 : 1,
      }} />
    </PanGestureHandler>
  );
});

const LevelSeaOfTwelves: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
      <TwelveGrid>
        {Array.from(Array(numTwelves), (_, index) => (
          <Twelve key={String(index)} />
        ))}
      </TwelveGrid>
    </LevelContainer>
  );
};

export default LevelSeaOfTwelves;
