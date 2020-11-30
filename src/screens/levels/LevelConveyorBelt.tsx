import React, { FunctionComponent, memo, useState, useEffect } from 'react';
import { Animated, Easing, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { navIconSize, SettingsIcon } from 'components/LevelNav/components'

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

// const trueGearWidth = navIconSize * 5/6;
const gearSize = navIconSize;
const numGears = 12;

const gearPeriod = 3000;
const gearCircumference = gearSize * Math.PI;
const beltLength = levelWidth * 3;
const beltCycle = gearPeriod * beltLength / gearCircumference;

const GearRow = styled.View`
  flex-direction: row;
  overflow: visible;
  width: 100%;
  justify-content: space-around;
`;

const SettingsContainer = styled.View`
  width: ${navIconSize * 2}px;
  height: ${navIconSize}px;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: red;
  overflow: visible;
`;

interface GearProps {
  index: number;
}

const GearContainer = styled(Animated.View)<GearProps>`
  position: absolute;
  /* ${props => (props.index % 2) ? '' : 'transform: rotate(30deg);'} */
`;

// TODO: See if there is a fix to this bug with styled-components
// @ts-ignore
const Gear = styled(SettingsIcon)`
`;

const numBelts = 12;
const beltWidth = levelWidth * 3;

const BeltSegment = styled.View`
  width: ${levelWidth / 4}px;
  height: ${navIconSize / 2}px;
  background-color: darkslateblue;
  border: ${navIconSize / 12}px solid steelblue;
`;

const BeltRow = styled.View`
  width: ${levelWidth}px;
  flex-direction: row;
  justify-content: space-around;
`;

const BeltChunk = styled(Animated.View)`
  flex-direction: column-reverse;
  justify-content: flex-start;
`;

const BeltContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const Belt: FunctionComponent = (props) => {
  // TODO
  const numBelts = levelWidth * 2
  return (
    <BeltSegment />
  );
};

const LevelConveyorBelt: Level = (props) => {
  const [gearAnim] = useState(new Animated.Value(0));
  // const [beltAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.timing(gearAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      // Animated.loop(
      //   Animated.timing(gearAnim, {
      //     toValue: 1,
      //     duration: 3000,
      //     easing: Easing.linear,
      //     useNativeDriver: true,
      //   })
      // ),
    ]).start();
  });

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const rotate = gearAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {/* <Row>
        {gearPositions.map((gearPosition, index) => (
          <GearContainer
            key={String(index)}
            index={index}
            style={{ ...gearPosition, transform: [{
              rotate: Animated.multiply(Animated.add(gearAnim, (index % 2) ? 0 : 1/12), index % 2 ? 1 : -1).interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              })
            }]}}
          >
            <Gear />
          </GearContainer>
        ))}
      </Row> */}
      <BeltContainer>
        <BeltChunk >
          <BeltRow>
            <BeltSegment />
            <BeltSegment />
            <BeltSegment />
            <BeltSegment />
          </BeltRow>
        </BeltChunk>
        <BeltChunk>
          <BeltRow>
            <BeltSegment />
            <BeltSegment />
            <BeltSegment />
            <BeltSegment />
          </BeltRow>
        </BeltChunk>
        <BeltChunk>
          <BeltRow>
            <BeltSegment />
            <BeltSegment />
            <BeltSegment />
            <BeltSegment />
          </BeltRow>
        </BeltChunk>
        {/* <BeltRow>
          <Coin />
          <Coin />
          <Coin />
          <Coin />
          <Coin />
          <Coin />
          <Coin />
          <Coin />
          <Coin />
          <Coin />
          <Coin />
          <Coin />
        </BeltRow> */}
      </BeltContainer>
      <GearRow>
        {Array.from(Array(12), (_, index) => <Gear key={String(index)} />)}
      </GearRow>
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

export default LevelConveyorBelt;
