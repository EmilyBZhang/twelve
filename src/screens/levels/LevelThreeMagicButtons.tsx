import React, { useState, useCallback, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const buttonSize = styles.coinSize * 2;
const gapSize = (levelWidth - buttonSize * 3) / 4;
const coinPositions = Array.from(Array(12), (_, index) => ({
  left: gapSize * (1 + Math.floor(index / 4)) + styles.coinSize * Math.floor(index / 2)
}));

const MagicButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed,
})`
  background-color: ${colors.foreground};
  border-radius: ${buttonSize / 2}px;
  justify-content: center;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  padding-top: ${buttonSize}px;
  padding-bottom: ${buttonSize}px;
`;

const ButtonSkeleton = styled.View`
  width: ${buttonSize}px;
  height: ${buttonSize}px;
  border-radius: ${buttonSize / 2}px;
`;

const CoinContainer = styled(Animated.View)`
  position: absolute;
`;

const LevelThreeMagicButtons: Level = (props) => {

  const [anim] = useState(new Animated.Value(0));
  const [magicNumber, setMagicNumber] = useState(1);

  const madeTwelve = magicNumber === 12;
  useEffect(() => {
    if (!madeTwelve) return;
    Animated.timing(anim, {
      toValue: buttonSize,
      duration: 1000,
      easing: Easing.circle,
      useNativeDriver: true,
    }).start();
  }, [madeTwelve]);

  const add7 = useCallback(() => setMagicNumber(magicNumber => magicNumber + 7), []);
  const mul2 = useCallback(() => setMagicNumber(magicNumber => magicNumber * 2), []);
  const neg = useCallback(() => setMagicNumber(magicNumber => -magicNumber), []);

  const numCoinsFound = props.coinsFound.size;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText fontSize={buttonSize}>{magicNumber}</LevelText>
      <ButtonsContainer>
        {madeTwelve && coinPositions.map((coinPosition, index) => (
          <CoinContainer
            key={String(index)}
            style={{
              ...coinPosition,
              transform: [{ translateY: Animated.multiply(anim, (index % 2) ? 1 : -1) }]
            }}
          >
            <Coin
              found={props.coinsFound.has(index)}
              onPress={() => props.onCoinPress(index)}
            />
          </CoinContainer>
        ))}
        <MagicButton disabled={madeTwelve} onPress={add7}>
          <ButtonSkeleton />
        </MagicButton>
        <MagicButton disabled={madeTwelve} onPress={mul2}>
          <ButtonSkeleton />
        </MagicButton>
        <MagicButton disabled={madeTwelve} onPress={neg}>
          <ButtonSkeleton />
        </MagicButton>
      </ButtonsContainer>
    </LevelContainer>
  );
};

export default LevelThreeMagicButtons;
