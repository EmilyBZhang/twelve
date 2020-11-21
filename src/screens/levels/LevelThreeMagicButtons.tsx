import React, { useState, useCallback } from 'react';
import { Animated, View } from 'react-native';
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

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const buttonSize = styles.coinSize * 2;

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
  padding-top: ${buttonSize}px;
  padding-bottom: ${buttonSize}px;
  background-color: green;
`;

const ButtonSkeleton = styled.View`
  width: ${buttonSize}px;
  height: ${buttonSize}px;
  border-radius: ${buttonSize / 2}px;
`;

const CoinsContainer = styled(Animated.View)`
  position: absolute;
  flex-direction: row;
`;

const LevelThreeMagicButtons: Level = (props) => {

  const [magicNumber, setMagicNumber] = useState(1);

  const add7 = useCallback(() => setMagicNumber(magicNumber => magicNumber + 7), []);
  const mul2 = useCallback(() => setMagicNumber(magicNumber => magicNumber * 2), []);
  const neg = useCallback(() => setMagicNumber(magicNumber => -magicNumber), []);

  const madeTwelve = magicNumber === 12;

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve} fontSize={buttonSize}>{magicNumber}</LevelText>
      <ButtonsContainer>
        <MagicButton disabled={madeTwelve} onPress={add7}>
          <>
            <ButtonSkeleton />
            <CoinsContainer>
              <Coin />
              <Coin />
              <Coin />
              <Coin />
            </CoinsContainer>
          </>
        </MagicButton>
        <MagicButton disabled={madeTwelve} onPress={mul2}>
          <>
            <ButtonSkeleton />
            <CoinsContainer>
              <Coin />
              <Coin />
              <Coin />
              <Coin />
            </CoinsContainer>
          </>
        </MagicButton>
        <MagicButton disabled={madeTwelve} onPress={neg}>
          <>
            <ButtonSkeleton />
            <CoinsContainer>
              <Coin />
              <Coin />
              <Coin />
              <Coin />
            </CoinsContainer>
          </>
        </MagicButton>
      </ButtonsContainer>
      {madeTwelve && coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelThreeMagicButtons;
