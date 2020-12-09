import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { getLevelDimensions } from 'utils/getDimensions';
import { gaussian, randElem, shuffleArray } from 'utils/random';
import ColorHint from 'components/ColorHint';
import ScavengerText from 'components/ScavengerText';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const carSize = styles.coinSize * 3;
const trackLength = levelWidth + carSize * 2;
const buttonSize = styles.coinSize * 2;

const finishStart = levelWidth - 2 * styles.coinSize;
const finishEnd = levelWidth - styles.coinSize;
const finishHeight = levelHeight;
const finishWidth = finishEnd - finishStart;

const withinBounds = (x: number) => (
  (x >= finishStart) && (x - carSize <= finishEnd)
);

const RaceTrack = styled.View`
  width: ${trackLength}px;
  height: ${levelHeight / 2}px;
  /* align-items: flex-start; */
`;

const SportsCar = styled(MaterialCommunityIcons).attrs({
  name: 'car-sports',
  size: carSize,
})``;

const CarContainer = styled(Animated.View)`
  justify-content: center;
  /* align-items: center; */
`;

const ColorHintContainer = styled.View`
  position: absolute;
  width: ${carSize}px;
  align-items: center;
`;

const FinishLine = styled.View`
  position: absolute;
  left: ${finishStart}px;
  top: 0px;
  width: ${finishWidth}px;
  height: ${finishHeight}px;
  background-color: ${colors.foreground};
`;

const CameraButton = styled.View`
  position: absolute;
  left: ${styles.coinSize}px;
  bottom: ${styles.coinSize}px;
  width: ${buttonSize}px;
  height: ${buttonSize}px;
  border-radius: ${buttonSize / 2}px;
`;

const LevelTextContainer = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  padding: ${styles.coinSize / 3}px;
`;

const animParams = [
  { easing: Easing.linear, duration: 3000 },
  { easing: Easing.linear, duration: 2500 },
  { easing: Easing.quad, duration: 2000 },
  { easing: Easing.linear, duration: 2000 },
  { easing: Easing.poly(0.5), duration: 2000 },
  { easing: Easing.linear, duration: 1500 },
  { easing: Easing.ease, duration: 2000 },
  { easing: Easing.linear, duration: 1500 },
  { easing: Easing.exp, duration: 3000 },
  { easing: Easing.exp, duration: 2500 },
  { easing: Easing.exp, duration: 2000 },
  { easing: Easing.linear, duration: 3000 },
];

const LevelRacecar: Level = (props) => {

  const [goodCar, setGoodCar] = useState(true);
  const [cameraDisabled, setCameraDisabled] = useState(false);
  const [anim] = useState(new Animated.Value(0));
  const animValue = useRef(0);
  const numCoinsFoundRef = useRef(0);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;


  useEffect(() => {
    const listener = anim.addListener(({ value }) => {
      animValue.current = value;
    });
    return () => anim.removeListener(listener);
  }, []);

  useEffect(() => {
    const good = [true, true, false];
    let index = 0;
    let exited = false;
    const iter = () => {
      Animated.timing(anim, {
        toValue: trackLength - carSize,
        useNativeDriver: true,
        ...animParams[numCoinsFoundRef.current % 12]
      }).start(() => {
        setTimeout(() => {
          if (exited) return;
          index++;
          if (index >= good.length) {
            index = 0;
            shuffleArray(good);
          }
          setGoodCar(good[index]);
          setCameraDisabled(false);
          anim.setValue(0);
          iter();
        }, 500);
      });
    };
    iter();
    return () => { exited = true; };
  }, []);

  const handleCoinPress = () => {
    setCameraDisabled(true);
    if (!withinBounds(animValue.current)) return;
    if (goodCar) {
      numCoinsFoundRef.current++;
      props.onCoinPress();
    }
    else {
      numCoinsFoundRef.current = 0;
      props.setCoinsFound();
    } 
  };

  const color = goodCar ? colors.coin : colors.badCoin;

  return (
    <LevelContainer>
      <LevelTextContainer>
        <LevelText>The Dozen Pri<ScavengerText>x</ScavengerText></LevelText>
      </LevelTextContainer>
      <LevelCounter count={numCoinsFound} position={{ right: 0, top: 0 }} />
      <FinishLine />
      <RaceTrack>
        <CarContainer style={{ transform: [{ translateX: anim }] }}>
          <SportsCar color={color} />
          <ColorHintContainer>
            <ColorHint color={color} />
          </ColorHintContainer>
        </CarContainer>
      </RaceTrack>
      <CameraButton>
        <Coin
          size={buttonSize}
          color={colors.selectCoin}
          disabled={cameraDisabled}
          onPressIn={handleCoinPress}
        />
      </CameraButton>
    </LevelContainer>
  );
};

export default LevelRacecar;
