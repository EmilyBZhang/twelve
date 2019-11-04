import React, { useState, useEffect } from 'react';
import { Button, View, Animated } from 'react-native';
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
const deltaX = levelWidth / 5;
const deltaY = levelHeight / 4;
const initX = deltaX * 2 - coinSize / 2;
const initY = deltaY - coinSize / 2;

const coinPositions = Array.from(Array(12), (_, i) => {
  const index = i % 6;
  const r = Math.floor(index / 3);
  const c = index % 3;
  return ({
    top: initY + deltaY * r,
    left: initX + deltaX * c,
    zIndex: (i < 6) ? 1 : 0
  });
});

const resultBitPositions = Array.from(Array(4), (_, index) => ({
  position: 'absolute',
  top: initY + deltaY * 2,
  left: initX + deltaX * (index - 1)
}));

const Plus = styled.View.attrs({
  children: <LevelText>+</LevelText>
})`
  position: absolute;
  width: ${coinSize}px;
  height: ${coinSize}px;
  justify-content: center;
  align-items: center;
  left: ${initX - deltaX}px;
  top: ${initY + deltaY}px;
`;

const Line = styled.View`
  position: absolute;
  left: ${initX - deltaX}px;
  top: ${initY + deltaY * 1.5 + coinSize / 2 - 2}px;
  background-color: black;
  width: ${coinSize + deltaX * 3}px;
  height: 4px;
`;

const LevelBinary1: Level = (props) => {
  const [onBits, toggleBit] = useSelectedIndices();
  const [result, setResult] = useState(0);
  const [coinRevealAnim] = useState(new Animated.Value(0));

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleBitPress = (index: number) => {
    const nums = Array.from(Array(2), (_, rowIndex) => {
      let result = 0;
      for (let i = 3 * rowIndex; i < 3 * (rowIndex + 1); i++) {
        result <<= 1;
        result += ((i === index) !== onBits.has(i)) ? 1 : 0;
      }
      return result;
    });
    const result = nums[0] + nums[1];
    toggleBit(index);
    setResult(result);
  }

  const twelveAchieved = result === 12;
  const handleCoinPress = twelveAchieved ? props.onCoinPress : handleBitPress;

  useEffect(() => {
    if (!twelveAchieved) return;
    Animated.timing(coinRevealAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }, [twelveAchieved]);

  const calcTranslation = (index: number) => {
    if (index < 6) return 0;
    const delta = deltaY / 3 * ((index < 9) ? 1 : -1);
    return Animated.multiply(coinRevealAnim, delta);
  };

  const coins = coinPositions.map((coinPosition, index) => {
    const bitColor = onBits.has(index % 6) ? colors.onCoin : colors.offCoin;

    return (
      <Animated.View
        key={String(index)}
        style={{
          ...coinPosition,
          position: 'absolute',
          transform: [
            {translateY: calcTranslation(index)}
          ]
        }}
      >
        <Coin
          found={props.coinsFound.has(index)}
          onPress={() => handleCoinPress(index)}
        >
          <BitColor style={{
            backgroundColor: bitColor,
            opacity: Animated.subtract(1, coinRevealAnim),
          }}>
            <ColorHint
              color={bitColor}
              size={coinSize / 2}
            />
          </BitColor>
        </Coin>
      </Animated.View>
    );
  });

  const resultBits = resultBitPositions.map((resultBitPosition, index) => {
    const shift = resultBitPositions.length - index - 1;
    // See if the bit at index should be on (i.e. its position is 1)
    const bit = (result >> shift) & 1;
    const bitColor = bit ? colors.onCoin : colors.offCoin;
    return (
      <BitColor
        square
        key={String(index)}
        style={{
          backgroundColor: bitColor,
          ...resultBitPosition
        }}
      >
        <ColorHint
          color={bitColor}
          size={coinSize / 2}
        />
      </BitColor>
    );
  });

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {coins}
      <Plus />
      <Line />
      {resultBits}
    </LevelContainer>
  );
};

export default LevelBinary1;
