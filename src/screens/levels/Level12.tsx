import React, { useState, useEffect, useCallback } from 'react';
import { Animated, Easing, TouchableOpacity, Platform, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import getDimensions from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import { CenterContainer, LeftContainer, NavButton, TopText } from 'components/LevelNav/components';
import SettingsModal from 'components/SettingsModal';
import { SettingsIcon } from 'components/LevelNav/components'
import { LevelNavText, LevelNavContainer } from 'components/SettingsModal/components';
import { HAS_NOTCH } from 'res/constants';

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

const SettingsButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${styles.levelNavHeight}px;
  height: ${styles.levelNavHeight}px;
  justify-content: center;
  align-items: center;
  z-index: ${styles.levelNavZIndex + 1}px;
`;

const Level12: Level = (props) => {

  const [coinOpacity] = useState(new Animated.Value(0));
  const [isRevealed, setIsRevealed] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    if (!isRevealed) return;
    Animated.timing(coinOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isRevealed]);

  const handleReveal = useCallback(() => setIsRevealed(true), []);
  const handleSettingsClose = useCallback(() => setModalOpened(false), []);
  const handleGoToLevelSelect = useCallback(() => {
    props.navigation.navigate('Level', { level: 0 });
  }, []);
  const handleRestart = useCallback(() => {
    props.navigation.goBack();
    props.navigation.navigate('Level', { level: props.levelNum });
  }, []);
  const handlePrevLevel = useCallback(() => {
    props.navigation.navigate('Level', { level: props.levelNum - 1 });
  }, []);
  const handleNextLevel = useCallback(() => {
    props.setCoinsFound(new Set<number>());
    props.navigation.navigate('Level', { level: props.levelNum + 1 });
  }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <>
      <SettingsButton onPress={() => setModalOpened(true)}>
        <SettingsIcon />
      </SettingsButton>
      <SettingsModal
        title={`Level ${props.levelNum}`}
        visible={modalOpened}
        onClose={handleSettingsClose}
        onGoToLevelSelect={handleGoToLevelSelect}
        onRestart={handleRestart}
        level={props.levelNum}
        onPrevLevel={handlePrevLevel}
        onNextLevel={handleNextLevel}
      >
        <TransformedContainer
          pointerEvents={'box-none'}
          style={{ transform: [{ translateY: styles.levelNavHeight }]}}
        >
          <LevelNavContainer
            pointerEvents={'box-none'}
            style={{ backgroundColor: 'transparent' }}
          >
            <Animated.View style={{ opacity: Animated.subtract(1, coinOpacity) }}>
              <TouchableOpacity onPressIn={handleReveal}>
                <LevelNavText style={{ color: colors.coin }}>12</LevelNavText>
              </TouchableOpacity>
            </Animated.View>
            {isRevealed && (
              <CoinsContainer style={{ opacity: coinOpacity }}>
                <Coin
                  found={twelve}
                  onPress={() => props.onCoinPress(numCoinsFound)}
                />
              </CoinsContainer>
            )}
          </LevelNavContainer>
        </TransformedContainer>
      </SettingsModal>
      <TransformedContainer pointerEvents={'box-none'}>
        {!HAS_NOTCH && (
          <>
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
            {isRevealed && (
              <CoinsContainer style={{ opacity: coinOpacity }}>
                <Coin
                  found={twelve}
                  onPress={() => props.onCoinPress(numCoinsFound)}
                />
              </CoinsContainer>
            )}
          </>
        )}
        {HAS_NOTCH && (
          <LeftContainer>
            <NavButton>
              <SettingsIcon />
            </NavButton>
            <View style={{height: styles.levelNavHeight, alignItems: 'center', justifyContent: 'flex-end'}}>
              <TouchableOpacity onPressIn={handleReveal}>
                <Animated.View style={{ opacity: Animated.subtract(1, coinOpacity) }}>
                  <TopText style={{ color: colors.coin }}>12</TopText>
                </Animated.View>
              </TouchableOpacity>
              {isRevealed && (
                <CoinsContainer style={{ opacity: coinOpacity, backgroundColor: 'transparent' }}>
                  <Coin
                    found={twelve}
                    onPress={() => props.onCoinPress(numCoinsFound)}
                  />
                </CoinsContainer>
              )}
            </View>
          </LeftContainer>
        )}
      </TransformedContainer>
      {/* {HAS_NOTCH && (
        <LevelNavContainer style={{ zIndex: styles.levelNavZIndex + 1 }}>
          <LeftContainer>
            <SettingsIcon style={{ transform: [{translateX: 10}] }} />
          </LeftContainer>
        </LevelNavContainer>
      )} */}
      <LevelContainer>
        <LevelCounter count={numCoinsFound} />
      </LevelContainer>
    </>
  );
};

export default Level12;
