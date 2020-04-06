import React, { useState, useMemo } from 'react';
import { Animated, PanResponder } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { getLevelDimensions } from 'utils/getDimensions';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const Square = styled(Animated.View)`
  width: ${levelWidth / 2}px;
  height: ${levelWidth / 2}px;
  background-color: red;
`;

const LevelHoleJigsaw: Level = (props) => {

  const [anim] = useState(new Animated.Value(1));

  const scale = Animated.add(1, Animated.multiply(2, anim));

  // const panResponder = useMemo(() => PanResponder.create({
  //   onStartShouldSetPanResponder: (e, gestureState) => true,
  //   onStartShouldSetPanResponderCapture: (e, gestureState) => true,
  //   onMoveShouldSetPanResponder: (e, gestureState) => true,
  //   onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
  //   onPanResponderTerminationRequest: (e, gestureState) => true,
  //   onShouldBlockNativeResponder: (e, gestureState) => true,
  //   onPanResponderGrant: (e, gestureState) => {
  //     setWindowsillActive(true);
  //   },
  //   onPanResponderMove: (e, gestureState) => {
  //     const dy = calcDy(windowOffset + gestureState.dy);
  //     Animated.event([{dy: translateYAnim}])({dy});
  //   },
  //   onPanResponderRelease: (e, gestureState) => {
  //     setWindowsillActive(false);
  //     const dy = calcDy(windowOffset + gestureState.dy);
  //     setWindowOffset(dy);
  //   },
  //   onPanResponderTerminate: (e, gestureState) => {
  //     setWindowsillActive(false);
  //     const dy = calcDy(windowOffset + gestureState.dy);
  //     setWindowOffset(dy);
  //   },
  // }), [windowOffset]);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handlePress = () => {
    // Animated.event([{scale: anim}])({scale: 1.2}, {useNativeDriver: true});
    Animated.timing(anim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <TouchableOpacity onPress={handlePress}>
        <Square style={{
          transform: [{scaleX: scale}, {scaleY: scale}]
        }} />
      </TouchableOpacity>
    </LevelContainer>
  );
};

export default LevelHoleJigsaw;
