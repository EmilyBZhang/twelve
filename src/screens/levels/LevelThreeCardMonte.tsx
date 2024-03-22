/**
 * Triangle geometry: 2+2*sqrt(3)*r is the length of the surrounding triangle side
 * Offset for making third circle tangential: r * (2 - Math.sqrt(3)) / 2
 */

import React, { useState, useEffect } from 'react';
import { Animated, Easing, Text } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { coinSize } = styles;

const containerSize = levelWidth;
const cupSize = coinSize * 2;
const containerBound = containerSize - cupSize;

const GameContainer = styled.View`
  width: ${containerSize}px;
  height: ${containerSize}px;
  background-color: #00000010;
`;

const Row = styled.View`
  flex-direction: row;
`;

const CupContainer = styled(Animated.View)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${cupSize}px;
  height: ${cupSize}px;
  justify-content: center;
  align-items: center;
  /* margin-left: ${coinSize * 3 / 8}px;
  margin-right: ${coinSize * 3 / 8}px; */
`;

const Cup = styled(Animated.View)`
  width: ${cupSize}px;
  height: ${cupSize}px;
  border-radius: ${cupSize / 2}px;
  background-color: green;
  z-index: 1;
  position: absolute;
`;

const getQuadrantTiming = (anim: Animated.Value, toValue: number, duration = 1000) => {
  const easing = (toValue === 0.5) ? Easing.sin : Easing.out(Easing.sin);
  return Animated.timing(anim, {
    toValue,
    duration,
    easing,
    useNativeDriver: true
  });
};

const LevelThreeCardMonte: Level = (props) => {

  const [cup1X] = useState(new Animated.Value(0));
  const [cup1Y] = useState(new Animated.Value(0.5));
  const [cup2X] = useState(new Animated.Value(0));
  const [cup2Y] = useState(new Animated.Value(0));
  const [cup3X] = useState(new Animated.Value(1));
  const [cup3Y] = useState(new Animated.Value(1));

  const cups = [
    {x: cup1X, y: cup1Y},
    // {x: cup2X, y: cup2Y},
    // {x: cup3X, y: cup3Y},
  ];
  const cupPositions = cups.map(({ x, y }) => ({
    transform: [
      // {translateX: Animated.multiply(x, containerBound)},
      {translateX: x.interpolate({
        inputRange: [0, 1],
        outputRange: [containerBound, 0],
        easing: t => {
          console.log(Math.abs(Math.sin(t * Math.PI * 2)));
          return Math.abs(Math.sin(t * Math.PI * 2));
        }
      })},
      {translateY: Animated.multiply(y, containerBound)},
    ]
  }));

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  useEffect(() => {
    // Animated.sequence([
    //   getQuadrantTiming(cup1X, 0.5),
    //   getQuadrantTiming(cup1X, 0),
    //   getQuadrantTiming(cup1X, 0.5),
    //   getQuadrantTiming(cup1X, 1),
    // ]),
    // Animated.sequence([
    //   getQuadrantTiming(cup1Y, 0),
    //   getQuadrantTiming(cup1Y, 0.5),
    //   getQuadrantTiming(cup1Y, 1),
    //   getQuadrantTiming(cup1Y, 0.5),
    // ]),
    Animated.loop(Animated.parallel([
      Animated.timing(cup1X, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear
      }),
    ])).start();
    // Animated.loop(
    //   Animated.sequence([
    //     Animated.parallel([
    //       Animated.timing(cup1X, {
    //         toValue: 0.5,
    //         duration: 1000,
    //         easing: t => {
    //           if (t === 1) console.log(new Date().getTime());
    //           return Easing.sin(t);
    //         },
    //         useNativeDriver: true
    //       }),
    //       Animated.timing(cup1Y, {
    //         toValue: 0,
    //         duration: 1000,
    //         easing: Easing.out(Easing.sin),
    //         useNativeDriver: true
    //       }),
    //     ]),
    //     Animated.parallel([
    //       Animated.timing(cup1X, {
    //         toValue: 0,
    //         duration: 1000,
    //         easing: Easing.out(Easing.sin),
    //         useNativeDriver: true
    //       }),
    //       Animated.timing(cup1Y, {
    //         toValue: 0.5,
    //         duration: 1000,
    //         easing: t => {
    //           if (t === 1) console.log(new Date().getTime());
    //           return Easing.sin(t);
    //         },
    //         useNativeDriver: true
    //       }),
    //     ]),
    //     Animated.parallel([
    //       Animated.timing(cup1X, {
    //         toValue: 0.5,
    //         duration: 1000,
    //         easing: Easing.sin,
    //         useNativeDriver: true
    //       }),
    //       Animated.timing(cup1Y, {
    //         toValue: 1,
    //         duration: 1000,
    //         easing: Easing.out(Easing.sin),
    //         useNativeDriver: true
    //       }),
    //     ]),
    //     Animated.parallel([
    //       Animated.timing(cup1X, {
    //         toValue: 1,
    //         duration: 1000,
    //         easing: Easing.out(Easing.sin),
    //         useNativeDriver: true
    //       }),
    //       Animated.timing(cup1Y, {
    //         toValue: 0.5,
    //         duration: 1000,
    //         easing: Easing.sin,
    //         useNativeDriver: true
    //       }),
    //     ]),
    //   ])
    // ).start();
    // Animated.parallel([
    //   Animated.sequence([
    //     Animated.timing(cup1X, {
    //       toValue: 0.5,
    //       duration: 1000,
    //       easing: Easing.sin,
    //       useNativeDriver: true
    //     }),
    //     Animated.timing(cup1X, {
    //       toValue: 0,
    //       duration: 1000,
    //       easing: Easing.out(Easing.sin),
    //       useNativeDriver: true
    //     }),
    //     Animated.timing(cup1X, {
    //       toValue: 0.5,
    //       duration: 1000,
    //       easing: Easing.sin,
    //       useNativeDriver: true
    //     }),
    //     Animated.timing(cup1X, {
    //       toValue: 1,
    //       duration: 1000,
    //       easing: Easing.out(Easing.sin),
    //       useNativeDriver: true
    //     }),
    //   ]),
    //   Animated.sequence([
    //     Animated.timing(cup1Y, {
    //       toValue: 0,
    //       duration: 1000,
    //       easing: Easing.out(Easing.sin),
    //       useNativeDriver: true
    //     }),
    //     Animated.timing(cup1Y, {
    //       toValue: 0.5,
    //       duration: 1000,
    //       easing: Easing.sin,
    //       useNativeDriver: true
    //     }),
    //     Animated.timing(cup1Y, {
    //       toValue: 1,
    //       duration: 1000,
    //       easing: Easing.out(Easing.sin),
    //       useNativeDriver: true
    //     }),
    //     Animated.timing(cup1Y, {
    //       toValue: 0.5,
    //       duration: 1000,
    //       easing: Easing.sin,
    //       useNativeDriver: true
    //     }),
    //   ]),
    // ]).start();
  }, []);

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <GameContainer>
        {cupPositions.map((cupPosition, index) => (
          <CupContainer
            key={String(index)}
            style={cupPosition}
          >
            <Coin
              found={props.coinsFound.has(index)}
              onPress={() => props.onCoinPress(index)}
            />
            <Cup><Text>{index}</Text></Cup>
          </CupContainer>
        ))}
      </GameContainer>
      {/* {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))} */}
    </LevelContainer>
  );
};

export default LevelThreeCardMonte;
