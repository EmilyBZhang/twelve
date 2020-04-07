import React, { useState, useEffect } from 'react';
import { Animated, Easing, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import getDimensions, { getLevelDimensions } from 'utils/getDimensions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import styles from 'assets/styles';

const { width: screenWidth, height: screenHeight } = getDimensions();
const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const numLanes = 4;
const racerIds = Array.from(Array(numLanes), (_, index) => index + 9);

const Lane = styled.TouchableOpacity`
  height: ${levelHeight}px;
  width: ${levelWidth / numLanes}px;
  background-color: #00000040;
  border-right-width: 1px;
  justify-content: flex-end;
`;

const Racer = styled(Animated.View)``;

const LanesContainer = styled.View`
  flex-direction: row;
`;

const LevelRace: Level = (props) => {

  const [multipliers, setMultipliers] = useState(() => racerIds.map(racerId => (
    -144 / (racerId * racerId)
  )));
  const [raceAnim] = useState(new Animated.Value(-styles.levelTextSize));

  useEffect(() => {
    Animated.loop(
      Animated.timing(raceAnim, {
        toValue: screenHeight,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleLanePressIn = (index: number) => {
    setMultipliers(multipliers => [
      ...multipliers.slice(0, index),
      multipliers[index] * 2,
      ...multipliers.slice(index + 1),
    ]);
  };

  const handleLanePressOut = (index: number) => {
    setMultipliers(multipliers => [
      ...multipliers.slice(0, index),
      multipliers[index] / 2,
      ...multipliers.slice(index + 1),
    ]);
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} position={{}} />
      <LanesContainer>
        {racerIds.map((racerId, index) => {
          const translateY = Animated.multiply(raceAnim, multipliers[index]);

          return (
            <Lane
              key={String(racerId)}
              onPressIn={() => handleLanePressIn(index)}
              onPressOut={() => handleLanePressOut(index)}
            >
              <Racer style={{transform: [{ translateY }]}}>
                <LevelText>{racerId}</LevelText>
              </Racer>
            </Lane>
          );
        })}
        </LanesContainer>
      {/* <LevelText hidden={twelve}>twelve</LevelText> */}
      {/* {coinPositions.map((coinPosition, index: number) => (
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
    </LevelContainer>
  );
};

export default LevelRace;
