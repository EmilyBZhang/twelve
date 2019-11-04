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
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ColorHint from 'components/ColorHint';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const coinSize = styles.coinSize;

const bitPositions = calcPositions(2, 4);
const coinPositions = bitPositions.concat(bitPositions);

const xGap = coinPositions[1].left - coinPositions[0].left;
const yGap = coinPositions[4].top - coinPositions[0].top;

// Maps the index of the top row to the bottom
const circuitMap = [
  [4, 5, 6],
  [6, 7],
  [5, 7],
  [7]
];

const linePositions = circuitMap.map((outputs, inIndex) => outputs.map((out) => ({
  x1: inIndex * xGap + 1,
  y1: 0,
  x2: (out - 4) * xGap + 1,
  y2: yGap
}))).reduce((accum, lines) => accum.concat(lines), []);

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
  const [circuitOpacityAnim] = useState(new Animated.Value(1));
  const [coinAnimComplete, setCoinAnimComplete] = useState(false);

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
  const handleCoinPress = twelveAchieved ? props.onCoinPress : handleBitPress;

  useEffect(() => {
    if (!twelveAchieved) return;
    Animated.parallel([
      Animated.timing(coinRevealAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(circuitOpacityAnim, {
        toValue: 0,
        duration: 1000
      })
    ]).start(() => setCoinAnimComplete(true));
  }, [twelveAchieved]);

  const circuitLines = linePositions.map((linePosition, index) => (
    <Line
      key={String(index)}
      stroke={colors.offCoin}
      {...linePosition}
    />
  ));

  const calcTranslation = (index: number) => {
    if (index < 8) return 0;
    const delta = yGap / 2 * ((index < 12) ? 1 : -1);
    return Animated.multiply(coinRevealAnim, delta);
  };

  const calcCoinBorderRadius = (index: number) => Animated.multiply(
    ((index % 8) < 4) ? 1 : coinRevealAnim,
    coinSize / 2
  );

  const coins = coinPositions.map((coinPosition, index) => {
    const bitColor = onBits.has(index % 8) ? colors.onCoin : colors.offCoin;

    return (
      <Animated.View
        key={String(index)}
        style={{
          ...coinPosition,
          position: 'absolute',
          zIndex: (index < 8) ? 1 : 0,
          backgroundColor: colors.coin,
          borderRadius: calcCoinBorderRadius(index),
          transform: [
            {translateY: calcTranslation(index)}
          ]
        }}
      >
        <Coin
          disabled={(index >= 4) && !coinAnimComplete}
          found={props.coinsFound.has(index) || (coinAnimComplete && (index >= 12))}
          onPress={() => handleCoinPress(index)}
        >
          <BitColor style={{
            backgroundColor: bitColor,
            opacity: Animated.subtract(1, coinRevealAnim),
            borderRadius: calcCoinBorderRadius(index)
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

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <CircuitSvgContainer opacity={circuitOpacityAnim}>
        <CircuitSvg>
          {circuitLines}
        </CircuitSvg>
      </CircuitSvgContainer>
      {coins}
    </LevelContainer>
  );
};

export default LevelBipartiteCircuit;
