import React, { useState } from 'react';
import { Button, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const ArrowContainer = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

interface ArrowIconProps {
  translateX?: number;
  translateY?: number;
}

const ArrowIcon = styled(MaterialCommunityIcons).attrs({
  size: styles.coinSize / 2,
  color: 'black'
})<ArrowIconProps>`
  ${props => (props.translateX || props.translateY) && (
    `transform:\
    ${props.translateX ? ` translateX(${props.translateX}px)` : ''}\
    ${props.translateY ? ` translateY(${props.translateY}px)` : ''};`
  )}
`;

const directions = [
  '3D', '1D', '1L',
  '1U', '1R', '2L',
  '2R', '1D', '1L',
  '1U', '1R', '3U',
];

const pointers = directions.map((direction, index) => {
  const mult = parseInt(direction[0]);
  switch (direction[1]) {
    case 'U': return index - mult * 3;
    case 'D': return index + mult * 3;
    case 'L': return index - mult;
    default:  return index + mult;
  }
});

const fullDirections = {
  U: 'up',
  D: 'down',
  L: 'left',
  R: 'right'
} as {[firstLetter: string]: string};

const icons = directions.map((direction) => {
  const fullDirection = fullDirections[direction[1]];
  let icon;
  switch (direction[0]) {
    case '1':
      icon = (
        <ArrowIcon name={`chevron-${fullDirection}`} />
      );
      break;
    case '2':
      icon = (
        <ArrowIcon name={`chevron-double-${fullDirection}`} />
      );
      break;
    default:
      // Combine two vector icons for a triple-arrow
      // The way it's set up, it only works for down/up
      icon = (
        <>
          <ArrowIcon
            name={`chevron-${fullDirection}`}
            translateY={styles.coinSize / 6}
          />
          <ArrowIcon
            name={`chevron-double-${fullDirection}`}
            translateY={-styles.coinSize / 6}
          />
        </>
      );
  }
  return (
    <ArrowContainer>
      {icon}
    </ArrowContainer>
  );
});

const LevelArrows: Level = (props) => {
  const [nextIndex, setNextIndex] = useState(-1);

  const numCoinsFound = props.coinsFound.size;

  const handleCoinPress = (index: number) => {
    if (index === nextIndex || nextIndex === -1) {
      props.onCoinPress(index);
      setNextIndex(pointers[index]);
    } else {
      props.setCoinsFound(new Set<number>());
      setNextIndex(-1);
    }
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            color={colors.orderedCoin}
            found={props.coinsFound.has(index)}
            onPress={() => handleCoinPress(index)}
            label={String(index)}
            colorHintOpacity={0}
          >
            {icons[index]}
          </Coin>
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelArrows;
