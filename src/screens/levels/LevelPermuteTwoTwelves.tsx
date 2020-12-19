import React, { useState, useRef } from 'react';
import { Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { positiveModulo } from 'utils/math';
import { arraysEqual } from 'utils/arrays';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const sharedIndex = 2;
const initShared = 'e';
const initWordX = ['l', 'w', '', 'w', 't', 'e'];
const initWordY = ['e', 'v', '', 't', 'l', 'v'];

// Moves to get to this state: RDDRRRUULLDR
const correct = {
  shared: 'e',
  wordX: ['t', 'w', '', 'l', 'v', 'e'],
  wordY: ['t', 'w', '', 'l', 'v', 'e'],
}
const checkSolved = (wordX: Array<string>, wordY: Array<string>, shared: string) => (
  shared === correct.shared
  && arraysEqual(wordX, correct.wordX)
  && arraysEqual(wordY, correct.wordY)
);

const wordLength = initWordX.length;
const wordSize = levelWidth;
const cellSize = wordSize / wordLength;

const { coinSize } = styles;
const largeCoinSize = (coinSize + cellSize) / 2;

const padding = {
  x: (levelWidth - cellSize * wordLength) / 2,
  y: (levelHeight - cellSize * wordLength) / 2,
};

const XContainer = styled.View`
  position: absolute;
  left: ${padding.x}px;
  top: ${padding.y + cellSize * sharedIndex}px;
  height: ${cellSize}px;
  width: ${wordSize}px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  /* background-color: ${colors.plainSurface}80; */
  flex-direction: row;
`;

const YContainer = styled.View`
  position: absolute;
  left: ${padding.x + cellSize * sharedIndex}px;
  top: ${padding.y}px;
  height: ${wordSize}px;
  width: ${cellSize}px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  /* background-color: ${colors.plainSurface}80; */
  flex-direction: column;
`;

const Cell = styled.View`
  width: ${cellSize - 2}px;
  height: ${cellSize - 2}px;
  background-color: ${colors.plainSurface}80;
  margin: 1px;
  justify-content: center;
  align-items: center;
`;

const sharedPosition = {
  position: 'absolute',
  left: padding.x + cellSize * sharedIndex,
  top: padding.y + cellSize * sharedIndex,
};

const CoinsContainer = styled(Animated.View)`
  position: absolute;
  left: 0px;
  top: 0px;
  width: ${levelWidth}px;
  height: ${levelHeight}px;
`;

const CoinContainer = styled.View`
  width: ${cellSize}px;
  height: ${cellSize}px;
  justify-content: center;
  align-items: center;
`;

const LevelPermuteTwoTwelves: Level = (props) => {

  const [wordX, setWordX] = useState(initWordX);
  const [wordY, setWordY] = useState(initWordY);
  const [animX] = useState(new Animated.Value(0));
  const [animY] = useState(new Animated.Value(0));
  const [coinOpacity] = useState(new Animated.Value(0));
  const shared = useRef(initShared);

  const isSolvedRef = useRef(false);
  if (!isSolvedRef.current && checkSolved(wordX, wordY, shared.current)) {
    isSolvedRef.current = true;
    Animated.timing(coinOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }
  const isSolved = isSolvedRef.current;

  const animate = (axis: 'x' | 'y', initValue: number) => {
    const anim = (axis === 'x') ? animX : animY;
    anim.setValue(initValue);
    Animated.timing(anim, {
      toValue: 0,
      duration: 1000 / 12,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const handleShiftX = (direction: number) => setWordX(wordX => {
    const oldShared = shared.current;
    const d = Math.sign(direction);
    if (d === 0) return wordX;
    shared.current = wordX[positiveModulo(sharedIndex - d, wordLength)];
    animate('x', -d);
    if (d < 0) return [
      ...wordX.slice(1, sharedIndex),
      oldShared,
      '',
      ...wordX.slice(sharedIndex + 2),
      wordX[0],
    ];
    return [
      wordX[wordLength - 1],
      ...wordX.slice(0, sharedIndex - 1),
      '',
      oldShared,
      ...wordX.slice(sharedIndex + 1, wordLength - 1),
    ];
  });

  const handleShiftY = (direction: number) => setWordY(wordY => {
    const oldShared = shared.current;
    const d = Math.sign(direction);
    if (d === 0) return wordY;
    shared.current = wordY[positiveModulo(sharedIndex - d, wordLength)];
    animate('y', -d);
    if (d < 0) return [
      ...wordY.slice(1, sharedIndex),
      oldShared,
      '',
      ...wordY.slice(sharedIndex + 2),
      wordY[0],
    ];
    return [
      wordY[wordLength - 1],
      ...wordY.slice(0, sharedIndex - 1),
      '',
      oldShared,
      ...wordY.slice(sharedIndex + 1, wordLength - 1),
    ];
  });

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
        <XContainer>
          <Animated.View style={{
            flexDirection: 'row',
            transform: [{ translateX: Animated.multiply(animX, cellSize) }],
          }}>
            <Cell><LevelText>{wordX[wordLength - 1]}</LevelText></Cell>
            {wordX.map((letter, index) => (
              <TouchableWithoutFeedback
                key={String(index)}
                onPressIn={() => handleShiftX(Math.sign(index - sharedIndex))}
              >
                <Cell>
                  <LevelText>{letter}</LevelText>
                </Cell>
              </TouchableWithoutFeedback>
            ))}
            <Cell><LevelText>{wordX[0]}</LevelText></Cell>
          </Animated.View>
        </XContainer>
      <YContainer>
        <Animated.View style={{
          transform: [{ translateY: Animated.multiply(animY, cellSize) }],
        }}>
          <Cell><LevelText>{wordY[wordLength - 1]}</LevelText></Cell>
          {wordY.map((letter, index) => (
            <TouchableWithoutFeedback
                key={String(index)}
                onPressIn={() => handleShiftY(Math.sign(index - sharedIndex))}
            >
              <Cell>
                <LevelText>{letter}</LevelText>
              </Cell>
            </TouchableWithoutFeedback>
          ))}
          <Cell><LevelText>{wordY[0]}</LevelText></Cell>
        </Animated.View>
      </YContainer>
      <Animated.View style={{
        ...sharedPosition,
        transform: [
          { translateX: Animated.multiply(animX, cellSize) },
          { translateY: Animated.multiply(animY, cellSize) },
        ],
      }}>
        <Cell>
          <LevelText>{shared.current}</LevelText>
        </Cell>
      </Animated.View>
      {isSolved && (
        <CoinsContainer style={{ opacity: coinOpacity }}>
          <XContainer>
            {Array.from(Array(6), (_, index) => (
              <CoinContainer key={String(index)}>
                <Coin
                  found={props.coinsFound.has(index)}
                  onPress={() => props.onCoinPress(index)}
                />
              </CoinContainer>
            ))}
          </XContainer>
          <YContainer pointerEvents={'box-none'}>
            {Array.from(Array(6), (_, index) => (
              <CoinContainer
                key={String(index + 6)}
                pointerEvents={(index === sharedIndex) ? 'box-none' : 'auto'}
              >
                <Coin
                  found={props.coinsFound.has(index + 6)}
                  onPress={() => props.onCoinPress(index + 6)}
                  size={(index === sharedIndex) ? largeCoinSize : coinSize}
                />
              </CoinContainer>
            ))}
          </YContainer>
        </CoinsContainer>
      )}
    </LevelContainer>
  );
};

export default LevelPermuteTwoTwelves;
