import React, { useState, useEffect, useCallback } from 'react';
import { Animated, Easing, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import getDimensions from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import { CenterContainer, TopText } from 'components/LevelNav/components';

const { width: windowWidth, height: windowHeight } = getDimensions();

const TransformedContainer = styled.View`
  position: absolute;
  width: ${windowWidth}px;
  height: ${windowHeight}px;
  z-index: ${styles.levelNavZIndex};
  align-items: center;
`;

const CoinsContainer = styled(Animated.View)`
  position: absolute;
  z-index: ${styles.levelNavZIndex + 1};
  width: ${styles.coinSize}px;
  height: ${styles.coinSize}px;
`;

const CoinContainer = styled(Animated.View)`
  position: absolute;
`;

const LevelPressLevelDisplay: Level = (props) => {

  const [coinOpacity] = useState(new Animated.Value(0));
  const [coinsRevealed, setCoinsRevealed] = useState(false);

  useEffect(() => {
    if (!coinsRevealed) return;
    Animated.timing(coinOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [coinsRevealed]);

  const handleReveal = useCallback(() => setCoinsRevealed(true), []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <>
      <TransformedContainer pointerEvents={'box-none'}>
        <CenterContainer
          pointerEvents={'box-none'}
          style={{ backgroundColor: 'transparent' }}
        >
          <Animated.View style={{ opacity: Animated.subtract(1, coinOpacity) }}>
            <TouchableOpacity onPressIn={handleReveal}>
              <TopText style={{ color: colors.coin }}>12</TopText>
            </TouchableOpacity>
          </Animated.View>
        </CenterContainer>
        {coinsRevealed && (
          <CoinsContainer style={{ opacity: coinOpacity }}>
            <Coin
              found={twelve}
              onPress={() => props.onCoinPress(numCoinsFound)}
            />
          </CoinsContainer>
        )}
      </TransformedContainer>
      <LevelContainer>
        <LevelCounter count={numCoinsFound} />
      </LevelContainer>
    </>
  );
};

export default LevelPressLevelDisplay;
