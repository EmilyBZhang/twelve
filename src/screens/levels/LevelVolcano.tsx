// TODO: Make some coins red coins
// TODO: Change animation to be a "popcorn" effect from the bottom
// TODO: Add ash-falling animation (similar to snowing)
// TODO: Add volcano image that the coins spawn out of (z-index 1)

import React, { useEffect, useRef, useState, FunctionComponent } from 'react';
import { Animated, Easing, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import getDimensions, { getLevelDimensions } from 'utils/getDimensions';
import { randInt, randFloat, bernoulli } from 'utils/random';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import colors from 'res/colors';

const { width: windowWidth, height: windowHeight } = getDimensions();
const { width: levelWidth, height: levelHeight } = getLevelDimensions();

// const deltaX = levelWidth / 13;
// const initX = deltaX - styles.coinSize;
// const initY = -styles.levelNavHeight - styles.coinSize;
const initX = (levelWidth - styles.coinSize) / 2;
const volcanoWidth = levelWidth * 13/12;
const volcanoRatio = 2480 / 1435;
const volcanoHeight = levelWidth / volcanoRatio;
const initY = levelHeight - levelWidth / volcanoRatio;

const coinPosition = {
  position: 'absolute',
  top: initY,
  left: initX
};

const generateInitOffsets = () => (
  Array.from(Array(12), () => new Animated.Value(0))
);

const VolcanoContainer = styled.View.attrs({
  pointerEvents: 'none',
})`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: ${volcanoWidth}px;
  height: ${volcanoHeight}px;
`;

const VolcanoFG = styled.Image.attrs({
  source: require('assets/images/volcano-fg.png'),
})`
  position: absolute;
  width: ${volcanoWidth}px;
  height: ${volcanoHeight}px;
`;

const VolcanoBG = styled.Image.attrs({
  source: require('assets/images/volcano-bg.png'),
})`
  position: absolute;
  width: ${volcanoWidth}px;
  height: ${volcanoHeight}px;
  z-index: -1;
`;

const counterPosition = {top: 0};

const LevelVolcano: Level = (props) => {
  const [xOffsets] = useState(generateInitOffsets);
  const [yOffsets] = useState(generateInitOffsets);
  const loopAnim = useRef(true);

  useEffect(() => {
    if (!loopAnim.current) return;
    const animCoin = (yOffset: Animated.Value, index: number) => {
      const xOffset = xOffsets[index];
      const factor = randFloat(1, 2);
      const duration = 2000 * factor;
      const xSign = bernoulli() ? 1 : -1;
      const minX = (levelWidth + styles.coinSize) / 2;
      Animated.parallel([
        Animated.timing(xOffset, {
          toValue: xSign * randInt(minX, minX * 2),
          duration,
          easing: Easing.linear,
          useNativeDriver: true
        }),
        Animated.sequence([
          Animated.timing(yOffset, {
            toValue: -levelHeight / 3 * factor,
            duration: duration / 2,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true
          }),
          Animated.timing(yOffset, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.quad,
            useNativeDriver: true
          }),
        ]),
      ]).start(() => {
        if (loopAnim.current) {
          xOffset.setValue(0);
          yOffset.setValue(0);
          animCoin(yOffset, index);
        }
      });
    };
    yOffsets.forEach(animCoin);
    return () => {
      loopAnim.current = false;
    };
  }, [loopAnim.current]);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = (index: number) => {
    if (props.coinsFound.has(index)) {
      props.setCoinsFound(new Set());
    } else {
      props.onCoinPress(index);
    }
  };

  return (
    <LevelContainer
      gradientColors={[`${colors.badCoin}80`, colors.background]}
    >
      <LevelCounter
        count={numCoinsFound}
        position={counterPosition}
      />
      <VolcanoContainer>
        <VolcanoBG />
      </VolcanoContainer>
      {yOffsets.map((yOffset, index: number) => (
        <Animated.View
          key={String(index)}
          style={{
            ...coinPosition,
            transform: [
              {translateY: yOffset},
              {translateX: xOffsets[index]},
            ]
          }}
        >
          <Coin
            color={props.coinsFound.has(index) ? colors.badCoin : colors.coin}
            onPress={() => handleCoinPress(index)}
          />
        </Animated.View>
      ))}
      <VolcanoContainer>
        <VolcanoFG />
      </VolcanoContainer>
    </LevelContainer>
  );
};

export default LevelVolcano;
