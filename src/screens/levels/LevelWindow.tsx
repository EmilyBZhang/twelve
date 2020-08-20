import React, { useMemo, useState } from 'react';
import { Alert, Animated, Button, PanResponder, View, Text } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const windowWidth = levelWidth * 2 / 3;
const windowFrameBorderWidth = 4;
const windowFrameWidth = windowWidth + windowFrameBorderWidth * 2;
const paneWidth = windowWidth / 2;
const paneBorderWidth = windowFrameBorderWidth / 2;
const windowsillHeight = 24;

const WindowFrame = styled.View`
  width: ${windowFrameWidth}px;
  height: ${windowFrameWidth + windowsillHeight}px;
  border: ${windowFrameBorderWidth}px solid brown;
  overflow: hidden;
`;

const Window = styled(Animated.View)`
  width: ${windowWidth}px;
  height: ${windowWidth}px;
  background-color: #ff000066;
  flex-direction: row;
  flex-wrap: wrap;
  z-index: 1;
`;

const WindowPane = styled.View`
  border: ${paneBorderWidth}px solid brown;
  width: ${paneWidth}px;
  height: ${paneWidth}px;
  justify-content: center;
  align-items: center;
`;

interface WindowsillProps {
  active: boolean;
}

const Windowsill = styled(Animated.View)<WindowsillProps>`
  width: ${windowWidth}px;
  height: ${windowsillHeight}px;
  background-color: ${props => props.active ? 'brown' : 'maroon'};
  border-left-width: ${paneBorderWidth}px;
  border-right-width: ${paneBorderWidth}px;
  border-style: solid;
  border-color: brown;
  z-index: 1;
`;

const coinSize = styles.coinSize;
const deltaPos = windowWidth / 4;
const initPos = (deltaPos - coinSize) / 2;
const coinStyles = Array.from(Array(8), (_, index) => {
  const left = initPos + deltaPos * (index % 4);
  const top = initPos + deltaPos * Math.min(index, 7 - index);
  return {left, top};
});

const calcDy = (dy: number) => Math.max(Math.min(dy, 0), -windowWidth);

const LevelWindow: Level = (props) => {
  const [windowsillActive, setWindowsillActive] = useState(false);
  const [windowOffset, setWindowOffset] = useState(0);
  const [translateYAnim] = useState(new Animated.Value(0));

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => true,
    onStartShouldSetPanResponderCapture: (e, gestureState) => true,
    onMoveShouldSetPanResponder: (e, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
    onPanResponderTerminationRequest: (e, gestureState) => true,
    onShouldBlockNativeResponder: (e, gestureState) => true,
    onPanResponderGrant: (e, gestureState) => {
      setWindowsillActive(true);
    },
    onPanResponderMove: (e, gestureState) => {
      const dy = calcDy(windowOffset + gestureState.dy);
      Animated.event([{dy: translateYAnim}])({dy});
    },
    onPanResponderRelease: (e, gestureState) => {
      setWindowsillActive(false);
      const dy = calcDy(windowOffset + gestureState.dy);
      setWindowOffset(dy);
    },
    onPanResponderTerminate: (e, gestureState) => {
      setWindowsillActive(false);
      const dy = calcDy(windowOffset + gestureState.dy);
      setWindowOffset(dy);
    },
  }), [windowOffset]);

  const renderCoin = (index: number) => (
    <Coin
      found={props.coinsFound.has(index)}
      onPress={() => props.onCoinPress(index)}
    />
  );

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const movingStyleProp = {
    style: {
      transform: [{translateY: translateYAnim}]
    }
  };

  const hintText = (windowOffset === 0) ? 'A lovely home decor' : 'What a nice breeze!';

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText>{hintText}</LevelText>
      <WindowFrame>
        <Window {...movingStyleProp}>
          {Array.from(Array(4), (_, index) => (
            <WindowPane key={String(index)}>
              {renderCoin(index + 8)}
            </WindowPane>
          ))}
        </Window>
        <Windowsill
          active={windowsillActive}
          {...movingStyleProp}
          {...panResponder.panHandlers}
        />
        {coinStyles.map((coinStyle, index: number) => (
          <View
            key={String(index)}
            style={{position: 'absolute', ...coinStyle}}
          >
            {renderCoin(index)}
          </View>
        ))}
      </WindowFrame>
    </LevelContainer>
  );
};

export default LevelWindow;
