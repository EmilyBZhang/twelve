import React from 'react';
import { Button, View } from 'react-native';

import { Level } from 'utils/interfaces';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import Clock, { clockSize, clockRadius } from './components/LevelClock/Clock';

const coinSize = clockSize * 13 / 144;
const coinPositions = Array.from(Array(12), (_, index) => {
  const rad = Math.PI * 2 * index / 12;
  const R = clockRadius - coinSize / 2;
  return ({
    top: R * (1 - Math.cos(rad)),
    left: R * (1 + Math.sin(rad))
  });
});

const LevelClock: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  // Since the level takes ~1 min to complete right now,
  // Consider inverting the relationship (you can't press things being crossed by red)
  const handleCoinPress = (index: number) => {
    const seconds = (new Date()).getSeconds();
    const dangerRange = seconds % 5 === 0 || seconds % 5 === 4;
    if (dangerRange || props.coinsFound.has(index)) {
      props.setCoinsFound(new Set<number>());
    } else {
      props.onCoinPress(index);
    }
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText>It's about time!</LevelText>
      <Clock>
        {coinPositions.map((coinPosition, index) => (
          <View
            key={String(index)}
            style={{position: 'absolute', ...coinPosition}}
          >
            <Coin
              size={coinSize}
              color={props.coinsFound.has(index) ? (
                  colors.badCoin
                ) : (
                  colors.selectCoin
              )}
              found={twelve}
              onPress={() => handleCoinPress(index)}
            />
          </View>
        ))}
      </Clock>
    </LevelContainer>
  );
};

export default LevelClock;
