// TODO: Make an easier level with 3 bits + 3 bits
// TODO: Change this level to "lock" a few bits (esp the last bits on the first two numbers)

import React, { useState, useEffect } from 'react';
import { Button, View, Animated } from 'react-native';
import { Foundation } from '@expo/vector-icons';
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
const initX = deltaX * 4 - coinSize / 2;
const initY = deltaY - coinSize / 2;

const coinPositions = Array.from(Array(12), (_, i) => {
  const index = (i < 9) ? i : (i - 9) * 3;
  const r = Math.floor(index / 3);
  const c = index % 3;
  return ({
    top: initY + deltaY * r,
    left: initX + deltaX * c,
    zIndex: (i < 9) ? 1 : 0
  });
});

const resultBitPositions = Array.from(Array(6), (_, index) => ({
  position: 'absolute',
  top: initY + deltaY * 3,
  left: initX + deltaX * (index - 3)
}));

interface OpProps {
  row: number;
}

const Op = styled(LevelText)<OpProps>`
  position: absolute;
  width: ${coinSize}px;
  height: ${coinSize}px;
  justify-content: center;
  align-items: center;
  left: ${initX - deltaX}px;
  top: ${props => initY + deltaY * props.row}px;
  z-index: -1;
`;

const Line = styled.View`
  position: absolute;
  left: ${initX - deltaX * 3}px;
  top: ${initY + deltaY * 2.5 + coinSize / 2 - 2}px;
  background-color: black;
  width: ${coinSize + deltaX * 5}px;
  height: 4px;
`;

const LockIcon = styled(Foundation).attrs({
  name: 'lock',
  size: coinSize / 2,
  color: 'black'
})``;

const MinusIcon = styled(Foundation).attrs({
  name: 'minus',
  size: coinSize / 2,
  color: 'white'
})``;

const lockedBits = new Set([2, 5]);

const LevelBinary: Level = (props) => {
  const [onBits, toggleBit] = useSelectedIndices(lockedBits);
  const [result, setResult] = useState(0);
  const [coinRevealAnim] = useState(new Animated.Value(0));
  const [coinAnimComplete, setCoinAnimComplete] = useState(false);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleBitPress = (index: number) => {
    const nums = Array.from(Array(3), (_, rowIndex) => {
      let result = 0;
      for (let i = 3 * rowIndex; i < 3 * (rowIndex + 1); i++) {
        result <<= 1;
        result += ((i === index) !== onBits.has(i)) ? 1 : 0;
      }
      return result;
    });
    const result = nums[0] * nums[1] - nums[2];
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
    }).start(() => setCoinAnimComplete(true));
  }, [twelveAchieved]);

  const calcTranslation = (index: number) => {
    if (index < 9) return 0;
    return Animated.multiply(coinRevealAnim, -deltaX);
  };

  const coins = coinPositions.map((coinPosition, index) => {
    const bitIndex = (index < 9) ? index : (index - 9) * 3;
    const bitColor = onBits.has(bitIndex) ? colors.onCoin : colors.offCoin;

    return (
      <Animated.View
        key={String(index)}
        style={{
          ...coinPosition,
          position: 'absolute',
          transform: [
            {translateX: calcTranslation(index)}
          ]
        }}
      >
        <Coin
          disabled={lockedBits.has(bitIndex) && !twelveAchieved}
          found={props.coinsFound.has(index)}
          onPress={() => handleCoinPress(index)}
        >
          <BitColor style={{
            backgroundColor: bitColor,
            opacity: Animated.subtract(1, coinRevealAnim),
          }}>
            {lockedBits.has(bitIndex) ? <LockIcon /> : (
              <ColorHint
                color={bitColor}
                size={coinSize / 2}
              />
            )}
          </BitColor>
        </Coin>
      </Animated.View>
    );
  });

  const resultBits = resultBitPositions.map((resultBitPosition, index) => {
    const shift = resultBitPositions.length - index - 1;
    const negative = result < 0;
    const unsignedResult = Math.abs(result);
    // See if the bit at index should be on (i.e. its position is 1)
    const bit = (unsignedResult >> shift) & 1;
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
        {(negative && index === 0) ? <MinusIcon /> : (
          <ColorHint
            color={bitColor}
            size={coinSize / 2}
          />
        )}
      </BitColor>
    );
  });

  // TODO: Consider making ops fade out (opacity -> 0)
  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {coins}
      {!coinAnimComplete && (<>
        <Op row={1}>×</Op>
        <Op row={2}>-</Op>
      </>)}
      <Line />
      {resultBits}
    </LevelContainer>
  );
};

export default LevelBinary;
