// TODO: Convert animation to an x translation so that useNativeDriver can be true

import React, { useState, useEffect } from 'react';
import { Animated, Button, Easing, View } from 'react-native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import coinPositions from 'utils/coinPositions';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ScavengerText from 'components/ScavengerText';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const deltaX = levelWidth / 3;
const deltaY = levelHeight / 5;
const initY = deltaY - styles.coinSize / 2;

const LevelCatchCoins: Level = (props) => {
  const [coinAnim] = useState(new Animated.Value(-1));

  useEffect(() => {
    Animated.loop(
      Animated.timing(coinAnim, {
        toValue: 1,
        easing: Easing.linear,
        duration: 10000,
        useNativeDriver: true
      })
    ).start();
  }, []);

  const calcTranslation = (index: number) => {
    const factor = levelWidth * (((index % 6) < 3) ? 1 : -1);
    return Animated.multiply(coinAnim, factor);
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>
        C<ScavengerText>a</ScavengerText>n you catch them?
      </LevelText>
      {coinPositions.map((coinPosition, index) => (
        <Animated.View
          key={String(index)}
          style={{
            ...coinPosition,
            position: 'absolute',
            transform: [{translateX: calcTranslation(index)}]
          }}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </Animated.View>
      ))}
    </LevelContainer>
  );
};

export default LevelCatchCoins;
