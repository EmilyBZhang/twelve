import React, { useState, useEffect } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import useSelectedIndices from 'hooks/useSelectedIndices';
import colors from 'assets/colors';
import styles from 'assets/styles';
import { BitColor } from './components/LevelBinary';
import { calcPositions } from 'utils/coinPositions';
import { flatten } from 'utils/arrays';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ColorHint from 'components/ColorHint';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const coinSize = styles.coinSize;

const positions = calcPositions(2, 4);
const bitPositions = positions.slice(0, 4);
const resultBitPositions = positions.slice(4);
console.log(bitPositions);
console.log(resultBitPositions);
const coinPositions = [
  ...bitPositions,
  ...resultBitPositions,
  ...resultBitPositions
];

const xGap = positions[1].left - positions[0].left;
const yGap = positions[4].top - positions[0].top;

// Maps the index of the top row to the bottom
const circuitMap = [
  [4, 5, 6],
  [6, 7],
  [5, 7],
  [7]
];

const linePositions = flatten(circuitMap.map((outputs, inIndex) => outputs.map((out) => ({
  x1: inIndex * xGap + 1,
  y1: 0,
  x2: (out - 4) * xGap + 1,
  y2: yGap
}))));

const CircuitSvgContainer = styled(Animated.View)`
  position: absolute;
  top: ${yGap}px;
  left: ${xGap - 1}px;
`;

const CircuitSvg = styled(Svg).attrs({
  width: xGap * 3 + 2,
  height: yGap,
  stroke: 'black'
})``;

const LevelBipartiteCircuit: Level = (props) => {

  const [onBits, toggleBit, setBits] = useSelectedIndices();
  const [coinRevealAnim] = useState(new Animated.Value(0));

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleBitPress = (index: number) => {
    // TODO: Consider optimizing
    // Repeatedly toggling bits could be inefficient because it creates a new set every time
    // But n=4, so it's probably fine
    const bits = new Set(onBits);
    const toggle = (index: number) => bits.has(index) ? bits.delete(index) : bits.add(index);
    toggle(index);
    circuitMap[index].forEach(outIndex => toggle(outIndex));
    setBits(bits);
  };

  const twelveAchieved = (
    onBits.has(4) && onBits.has(5) && !onBits.has(6) && !onBits.has(7)
  );

  useEffect(() => {
    if (!twelveAchieved) return;
    Animated.sequence([
      Animated.timing(coinRevealAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(coinRevealAnim, {
        toValue: 2,
        duration: 1000,
        useNativeDriver: true
      }),
    ]).start();
  }, [twelveAchieved]);

  const circuitLines = linePositions.map((linePosition, index) => (
    <Line
      key={String(index)}
      stroke={colors.offCoin}
      {...linePosition}
    />
  ));

  const calcTranslation = (index: number) => {
    const inputRange = [0, 1, 2];
    const down = yGap / 2;
    const up = -down;
    const outputRange = [
      0,
      (index < 4) ? down : up,
      (index < 8) ? up : down
    ];
    return coinRevealAnim.interpolate({inputRange, outputRange});
  };

  const bits = bitPositions.map((bitPosition, index) => {
    const bitColor = onBits.has(index) ? colors.onCoin : colors.offCoin;

    return (
      <View
        key={String(index)}
        style={{
          ...bitPosition,
          position: 'absolute',
        }}
      >
        <Coin
          color={bitColor}
          disabled={twelveAchieved}
          onPress={() => handleBitPress(index)}
        />
      </View>
    );
  });

  const coins = coinPositions.map((coinPosition, index) => (
    <Animated.View
      key={String(index)}
      style={{
        ...coinPosition,
        position: 'absolute',
        transform: [{translateY: calcTranslation(index)}]
      }}
    >
      <Coin
        found={props.coinsFound.has(index)}
        onPress={() => props.onCoinPress(index)}
      />
    </Animated.View>
  ));

  const resultBits = resultBitPositions.map((resultBitPosition, index) => {
    const bitColor = onBits.has(index + 4) ? colors.onCoin : colors.offCoin;
    return (
      <BitColor
        square
        key={String(index)}
        style={{
          backgroundColor: bitColor,
          position: 'absolute',
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
      <CircuitSvgContainer>
        <CircuitSvg>
          {circuitLines}
        </CircuitSvg>
      </CircuitSvgContainer>
      {coins}
      {bits}
      {resultBits}
    </LevelContainer>
  );
};

export default LevelBipartiteCircuit;
