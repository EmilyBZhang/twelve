import React, { useRef } from 'react';
import { View } from 'react-native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ScavengerText from 'components/ScavengerText';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { coinSize } = styles;

const distances = [1, 3, 6, 4, 1, 2, 2, 2, 2, 6, 4, 5];
const n = distances.length;

const delta = levelWidth / 4;
const basePadding = (delta - coinSize) / 2;
const margins = {
  x: basePadding,
  y: basePadding + (levelHeight - levelWidth) / 2,
};
const topPos = Array.from(Array(3), (_, index) => ({
  top: margins.y,
  left: margins.x + delta * index,
}));
const rightPos = Array.from(Array(3), (_, index) => ({
  top: margins.y + delta * index,
  left: margins.x + delta * 3,
}));
const bottomPos = Array.from(Array(3), (_, index) => ({
  top: margins.y + delta * 3,
  left: margins.x + delta * (3 - index),
}));
const leftPos = Array.from(Array(3), (_, index) => ({
  top: margins.y + delta * (3 - index),
  left: margins.x,
}));
const coinPositions = [...topPos, ...rightPos, ...bottomPos, ...leftPos];

const LevelHamiltonianPath: Level = (props) => {
  const prevIndex = useRef<number | null>(null);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  const handleCoinPress = (index: number) => {
    if (prevIndex.current === null) {
      prevIndex.current = index;
      props.onCoinPress(index);
      return;
    }
    const forwardIndex = (prevIndex.current + distances[prevIndex.current]) % n;
    const backwardIndex = (n + prevIndex.current - distances[prevIndex.current]) % n;
    if (index === forwardIndex || index === backwardIndex) {
      prevIndex.current = index;
      props.onCoinPress(index);
      return;
    }
    prevIndex.current = null;
    props.setCoinsFound();
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>
        Pockets full{'\n'}of <ScavengerText>p</ScavengerText>osies
      </LevelText>
      {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            color={colors.orderedCoin}
            colorHintOpacity={0}
            found={props.coinsFound.has(index)}
            onPress={() => handleCoinPress(index)}
          >
            <LevelText color={colors.darkText}>
              {distances[index]}
            </LevelText>
          </Coin>
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelHamiltonianPath;
