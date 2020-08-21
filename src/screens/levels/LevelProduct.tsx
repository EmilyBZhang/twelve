import React, { FunctionComponent, useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'assets/styles';
import colors from 'assets/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

interface Wardrobe {
  hats: number;
  shirts: number;
  pants: number;
}

const totalCounts = {
  hats: 3,
  shirts: 8,
  pants: 5,
} as Wardrobe;

const gridSize = levelWidth;
const cellSize = gridSize / 4;

const Grid = styled(Animated.View)`
  width: ${gridSize}px;
  height: ${gridSize}px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const Cell = styled.View`
  width: ${cellSize}px;
  height: ${cellSize}px;
  justify-content: center;
  align-items: center;
`;

interface ArrowProps {
  disabled: boolean;
  direction: 'left' | 'right';
  onPress: () => any;
}

const Arrow: FunctionComponent<ArrowProps> = (props) => {
  const { disabled, direction, onPress } = props;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <MaterialCommunityIcons
        name={`transfer-${direction}`}
        size={cellSize / 2}
        color={colors.foreground}
      />
    </TouchableOpacity>
  );
};

const LevelProduct: Level = (props) => {

  const [coinOpacity] = useState(new Animated.Value(0));
  const [person1, setPerson1] = useState(totalCounts);
  const person2 = {
    hats: totalCounts.hats - person1.hats,
    shirts: totalCounts.shirts - person1.shirts,
    pants: totalCounts.pants - person1.pants,
  };

  const numOutfits1 = person1.hats * person1.shirts * person1.pants;
  const numOutfits2 = person2.hats * person2.shirts * person2.pants;
  const isSolved = (numOutfits1 === 12) && (numOutfits2 === 12);

  useEffect(() => {
    if (!isSolved) return;
    Animated.timing(coinOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isSolved]);

  const transfer = (item: 'hats' | 'shirts' | 'pants', direction: -1 | 1) => {
    setPerson1(person1 => {
      const newAmount = Math.min(
        Math.max(person1[item] + direction, 0), totalCounts[item]
      );
      return ({...person1, [item]: newAmount});
    });
  };

  const numCoinsFound = props.coinsFound.size;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <Grid>
        <Cell>
          <LevelText>{person1.hats}</LevelText>
        </Cell>
        <Cell>
          <Arrow
            disabled={isSolved}
            direction={'left'}
            onPress={() => transfer('hats', 1)}
          />
        </Cell>
        <Cell>
          <Arrow
            disabled={isSolved}
            direction={'right'}
            onPress={() => transfer('hats', -1)}
          />
        </Cell>
        <Cell>
          <LevelText>{person2.hats}</LevelText>
        </Cell>
        <Cell>
          <LevelText>{person1.shirts}</LevelText>
        </Cell>
        <Cell>
          <Arrow
            disabled={isSolved}
            direction={'left'}
            onPress={() => transfer('shirts', 1)}
          />
        </Cell>
        <Cell>
          <Arrow
            disabled={isSolved}
            direction={'right'}
            onPress={() => transfer('shirts', -1)}
          />
        </Cell>
        <Cell>
          <LevelText>{person2.shirts}</LevelText>
        </Cell>
        <Cell>
          <LevelText>{person1.pants}</LevelText>
        </Cell>
        <Cell>
          <Arrow
            disabled={isSolved}
            direction={'left'}
            onPress={() => transfer('pants', 1)}
          />
        </Cell>
        <Cell>
          <Arrow
            disabled={isSolved}
            direction={'right'}
            onPress={() => transfer('pants', -1)}
          />
        </Cell>
        <Cell>
          <LevelText>{person2.pants}</LevelText>
        </Cell>
        <Cell>
          <LevelText>{numOutfits1}</LevelText>
        </Cell>
        <Cell />
        <Cell />
        <Cell>
          <LevelText>{numOutfits2}</LevelText>
        </Cell>
      </Grid>
      {isSolved && (
        <Grid style={{ position: 'absolute', opacity: coinOpacity }}>
          {Array.from(Array(12), (_, index) => (
            <Cell key={String(index)}>
              <Coin
                found={props.coinsFound.has(index)}
                onPress={() => props.onCoinPress(index)}
              />
            </Cell>
          ))}
        </Grid>
      )}
    </LevelContainer>
  );
};

export default LevelProduct;
