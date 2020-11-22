import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { getLevelDimensions } from 'utils/getDimensions';
import { gaussian, randElem } from 'utils/random';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const carSize = styles.coinSize * 3;
const trackLength = levelWidth + carSize * 2;

const numCars = 3;

const finishStart = levelWidth - 2 * styles.coinSize;
const finishEnd = levelWidth - styles.coinSize;
const finishHeight = levelHeight;
const finishWidth = finishEnd - finishStart;

const RaceTrack = styled.View`
  width: ${trackLength}px;
  /* align-items: flex-start; */
`;

const SportsCar = styled(MaterialCommunityIcons).attrs({
  name: 'car-sports',
  size: carSize,
  color: colors.coin,
})``;

const FinishLine = styled.View`
  position: absolute;
  left: ${finishStart}px;
  top: 0px;
  width: ${finishWidth}px;
  height: ${finishHeight}px;
  background-color: ${colors.darkText};
`;

const easings = [Easing.linear, Easing.exp, Easing.poly(0.5)];

const LevelRacecar: Level = (props) => {

  const [anims] = useState(() => Array.from(Array(numCars), () => new Animated.Value(0)));
  const animValues = useRef(anims.map(() => 0));

  useEffect(() => {
    anims.forEach((anim, index) => anim.addListener(({ value }) => {
      animValues.current[index] = value;
    }));
    return () => anims.forEach(anim => anim.removeAllListeners());
  }, []);

  useEffect(() => {
    const iter = (anim: Animated.Value) => {
      Animated.timing(anim, {
        toValue: trackLength - carSize,
        duration: 2500 + gaussian(0, 250),
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        anim.setValue(0);
        iter(anim);
      });
    };
    anims.forEach(anim => iter(anim));
  }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <FinishLine />
      <RaceTrack>
        {anims.map((anim, index) => (
          <Animated.View key={String(index)} style={{ transform: [{ translateX: anim }] }}>
            <SportsCar />
          </Animated.View>
        ))}
      </RaceTrack>
    </LevelContainer>
  );
};

export default LevelRacecar;
