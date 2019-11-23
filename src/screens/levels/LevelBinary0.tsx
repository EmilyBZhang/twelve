// Introduce the fact that 1100 = twelve
// Select 4 coins to make 1100

import React, { useState, useEffect } from 'react';
import { View, Animated } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import { BitColor } from './components/LevelBinary';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import useSelectedIndices from 'hooks/useSelectedIndices';
import ColorHint from 'components/ColorHint';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const coinSize = styles.coinSize;
const deltaX = levelWidth / 7;
const deltaY = levelHeight / 5;
const initX = deltaX - coinSize / 2;
const initY = deltaY - coinSize / 2;

const coinPositions = Array.from(Array(12), (_, index) => {
  const r = (index < 8) ? Math.floor(index / 4) : (index % 2);
  const c = (index < 8) ? (index % 4) : Math.floor((index - 8) / 2) * 3;
  return ({
    position: 'absolute',
    top: initY + deltaY * (r + 1),
    left: initX + deltaX * (c + 1),
  });
});

const bitPositions = Array.from(Array(4), (_, index) => ({
  position: 'absolute',
  top: initY + deltaY,
  left: initX + deltaX * (index + 1)
}));

const resultPositions = bitPositions.map((bitPosition, index) => ({
  ...bitPosition,
  top: bitPosition.top + deltaY
}));

const Line = styled.View`
  position: absolute;
  background-color: black;
  width: ${coinSize + deltaX * 3}px;
  height: 4px;
`;

interface BitResultProps {
  on?: boolean;
}

const BitResult = styled(BitColor)<BitResultProps>`
  background-color: ${props => props.on ? colors.onCoin : colors.offCoin};
`;

const LevelBinary0: Level = (props) => {
  const [onBits, toggleBit, setBits] = useSelectedIndices();
  const [yCoinAnim] = useState(new Animated.Value(0));
  const [xCoinAnim] = useState(new Animated.Value(0));
  const twelveAchieved = (
    onBits.has(0) && onBits.has(1) && !onBits.has(2) && !onBits.has(3)
  );

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  useEffect(() => {
    if (!twelveAchieved) return;
    
    Animated.sequence([
      Animated.timing(yCoinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(xCoinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start();
  }, [twelveAchieved]);

  const calcTranslation = (index: number) => {
    if (index < 8) {
      const delta = ((index < 4) ? -1 : 1) * deltaY;
      return ({
        translateX: 0,
        translateY: Animated.multiply(yCoinAnim, delta)
      });
    }
    const delta = ((index < 10) ? -1 : 1) * deltaX;
    return ({
      translateX: Animated.multiply(xCoinAnim, delta),
      translateY: 0
    });
  };

  const coins = coinPositions.map((coinPosition, index) => {
    const { translateX, translateY } = calcTranslation(index);

    return (
      <Animated.View
        key={String(index)}
        {...coinPosition}
        style={{
          transform: [{translateX}, {translateY}]
        }}
      >
        <Coin
          found={props.coinsFound.has(index)}
          onPress={() => props.onCoinPress(index)}
        />
      </Animated.View>
    );
  });

  const bits = bitPositions.map((bitPosition, index) => (
    <View
      key={String(index)}
      {...bitPosition}
    >
      <Coin
        disabled={twelveAchieved}
        color={onBits.has(index) ? colors.onCoin : colors.offCoin}
        onPress={() => toggleBit(index)}
      />
    </View>
  ));

  // TODO: Consider removing the box
  const resultBits = resultPositions.map((resultPosition, index) => {
    const shift = resultPositions.length - 1 - index;
    const val = 1 << shift;
    const textColor = (onBits.has(index)) ? colors.offCoin : colors.onCoin;
    return (
      <BitResult
        key={String(index)}
        square
        on={onBits.has(index)}
        {...resultPosition}
      >
        <LevelText
          fontSize={coinSize / 2}
          color={textColor}
        >
          {val}
        </LevelText>
      </BitResult>
    );
  });

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {coins}
      {bits}
      <Line />
      {resultBits}
    </LevelContainer>
  );
};

export default LevelBinary0;
