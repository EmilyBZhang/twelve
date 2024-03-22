import React, { FunctionComponent, memo, useState, useMemo } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { shuffleArray } from 'utils/random';
import ScavengerText from 'components/ScavengerText';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const coinSize = styles.coinSize;

const clockRadius = (levelWidth - coinSize) / 2;
const coinPositions = Array.from(Array(12), (_, index) => ({
  top: (levelHeight - coinSize) / 2 + clockRadius * Math.sin(2 * Math.PI * (index - 2) / 12),
  left: (levelWidth - coinSize) / 2 + clockRadius * Math.cos(2 * Math.PI * (index - 2) / 12),
}))

interface ClockHandProps {
  index: number;
}

const ClockHand: FunctionComponent<ClockHandProps> = memo((props) => {
  const { index } = props;

  return (
    <View style={{
      transform: [{rotate: `${(index + 1) * 30}deg`}]
    }}>
      <View style={{
        backgroundColor: 'black',
        width: coinSize / 12,
        height: coinSize / 2,
      }} />
      <View style={{
        backgroundColor: 'transparent',
        width: coinSize / 12,
        height: coinSize / 2,
      }} />
    </View>
  )
});

const LevelClockPointer: Level = (props) => {

  const [nextIndex, setNextIndex] = useState(-1);

  const order = useMemo(() => {
    const arr = Array.from(Array(12), (_, index) => index);
    shuffleArray(arr);
    return arr;
  }, []);
  const indexMap = useMemo(() => {
    const res = order.slice();
    order.forEach((num, index) => {
      res[num] = index;
    });
    return res;
  }, []);
  
  const handleCoinPress = (index: number) => {
    setNextIndex(nextIndex => {
      if (nextIndex === index || nextIndex === -1) {
        props.onCoinPress(index);
        return order[(indexMap[index] + 1) % order.length];
      }
      props.setCoinsFound(new Set());
      return -1;
    })
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>T<ScavengerText>h</ScavengerText>e Circle of 12</LevelText>
      {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            size={coinSize}
            colorHintOpacity={0}
            color={colors.orderedCoin}
            found={props.coinsFound.has(index)}
            onPress={() => handleCoinPress(index)}
          >
            <ClockHand index={order[(indexMap[index] + 1) % order.length]} />
          </Coin>
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelClockPointer;
