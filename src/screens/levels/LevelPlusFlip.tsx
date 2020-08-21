import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'assets/styles';
import colors from 'assets/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const gridN = 4;
const coinsContainerSize = levelWidth;
const coinContainerSize = coinsContainerSize / (gridN + 0.5);

const coinIndices = Array.from(Array(gridN * gridN), (_, index) => {
  const row = Math.floor(index / gridN);
  const col = index % gridN;
  const sidemost = (col === 0) || (col === gridN - 1);
  if (row === 0) return sidemost ? -1 : (index - 1);
  if (row === gridN - 1) return sidemost ? -1 : (index - 3);
  return index - 2;
});

const CoinsContainer = styled(Animated.View)`
  position: absolute;
  width: ${coinsContainerSize}px;
  height: ${coinsContainerSize}px;
  flex-direction: row;
  flex-wrap: wrap;
  padding: ${coinContainerSize / 4}px;
`;

const CoinContainer = styled.View`
  width: ${coinContainerSize}px;
  height: ${coinContainerSize}px;
  justify-content: center;
  align-items: center;
`;

const LevelPlusFlip: Level = (props) => {

  const [bits, setBits] = useState(() => (
    coinIndices.map(coinIndex => coinIndex === -1)
  ));
  const [coinOpacity] = useState(new Animated.Value(0));

  const numBitsOn = useRef(4);
  const isSolved = numBitsOn.current === gridN * gridN;

  useEffect(() => {
    if (!isSolved) return;
    Animated.timing(coinOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isSolved]);

  const handleBitPress = (index: number) => {
    const row = Math.floor(index / gridN);
    const col = index % gridN;
    /**
     * Checks if another index is neighboring the given index.
     * 
     * @param otherIndex Index to compare
     */
    const isNeighbor = (otherIndex: number) => {
      // Check if the other index is out of bounds
      if (otherIndex < 0 || otherIndex >= gridN * gridN) return false;
      // Check if the other index is not in the plus
      if (coinIndices[otherIndex] === -1) return false;
      // Check that the other index differs by either one row or one column
      const otherRow = Math.floor(otherIndex / gridN);
      const otherCol = otherIndex % gridN;
      return (row === otherRow || col === otherCol);
    };
    setBits(bits => {
      const newBits = [...bits];
      const changedIndices = [
        index - gridN,
        index - 1,
        index,
        index + 1,
        index + gridN
      ];
      changedIndices.forEach(changedIndex => {
        if (isNeighbor(changedIndex)) {
          const delta = newBits[changedIndex] ? -1 : 1;
          numBitsOn.current += delta;
          newBits[changedIndex] = !newBits[changedIndex];
        }
      });
      return newBits;
    });
  };

  const numCoinsFound = props.coinsFound.size;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <CoinsContainer style={{
        opacity: Animated.subtract(1, coinOpacity),
      }}>
        {bits.map((bit, index) => (
          <CoinContainer key={String(index)}>
            {(coinIndices[index] >= 0) && (
              <Coin
                noShimmer
                color={bit ? colors.onCoin : colors.offCoin}
                onPress={() => handleBitPress(index)}
              />
            )}
          </CoinContainer>
        ))}
      </CoinsContainer>
      {isSolved && (
        <CoinsContainer style={{ opacity: coinOpacity }}>
          {coinIndices.map((coinIndex, index) => (
            <CoinContainer key={String(index)}>
              {(coinIndex >= 0) && (
                <Coin
                  found={props.coinsFound.has(coinIndex)}
                  onPress={() => props.onCoinPress(coinIndex)}
                />
              )}
            </CoinContainer>
          ))}
        </CoinsContainer>
      )}
    </LevelContainer>
  );
};

export default LevelPlusFlip;
