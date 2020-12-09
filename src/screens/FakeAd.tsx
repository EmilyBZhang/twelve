// TODO: Make credits screen scroll slowly to the bottom
// IDEA: Make the links at the bottom of the credits each contained inside of a Coin

import React, { useState, useCallback, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Screen, LevelProps } from 'utils/interfaces';
import styles from 'res/styles';
import colors from 'res/colors';
import ScreenContainer from 'components/ScreenContainer';
import LevelText from 'components/LevelText';
import useSettings from 'hooks/useSettings';
import playAudio, { CreateAudioResult } from 'utils/playAudio';
import LevelCatchCoins from './levels/LevelCatchCoins';
import LevelRedLight from './levels/LevelRedLight';

const CloseIcon = styled(MaterialCommunityIcons).attrs({
  name: 'close',
  size: styles.levelNavHeight / 2,
  color: colors.foreground,
})``;

const CloseTouchable = styled.TouchableOpacity`
  border-radius: ${styles.levelNavHeight / 2}px;
  background-color: ${colors.onCoin}80;
  position: absolute;
  top: ${styles.levelNavHeight / 4}px;
  left: ${styles.levelNavHeight / 4}px;
  width: ${styles.levelNavHeight * 2 / 3}px;
  height: ${styles.levelNavHeight * 2 / 3}px;
  z-index: ${styles.levelNavZIndex};
  border: 2px solid ${colors.offCoin};
  justify-content: center;
  align-items: center;
`;

const openingMessageText = [
  `This`,
  `This game's`,
  `This game's\nTOO`,
  `This game's\nTOO HARD!!!`,
];

const taunt1 = 'Only 12% of\nplayers can\nsolve this';
const taunt2 = '👀';
const taunt3 = '🤔';

const Taunt1Container = styled.View.attrs({
  pointerEvents: 'none',
})`
  position: absolute;
  top: ${styles.levelNavHeight / 2}px;
  right: ${styles.levelNavHeight / 2}px;
  transform: rotate(15deg);
`;

const Taunt2Container = styled.View.attrs({
  pointerEvents: 'none',
})`
  position: absolute;
  bottom: ${styles.levelNavHeight}px;
  right: ${-styles.levelNavHeight}px;
  transform: rotate(30deg);
`;

const Taunt3Container = styled.View.attrs({
  pointerEvents: 'none',
})`
  position: absolute;
  bottom: ${styles.levelNavHeight}px;
  left: ${-styles.levelNavHeight}px;
  transform: rotate(-45deg) scaleX(-1);
`;

const LevelContainer = styled.View`
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
`;

const OpeningContainer = styled(Animated.View).attrs({
  pointerEvents: 'none',
})`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${colors.coin};
`;

type LevelPropsRef = React.MutableRefObject<React.PropsWithChildren<LevelProps>>;

const FakeAd: Screen = (props) => {
  const [refresh, setRefresh] = useState(new Date());
  const [openingMessage, setOpeningMessage] = useState('');
  const [anim] = useState(new Animated.Value(1));

  const propsRef = props.navigation.getParam('propsRef') as LevelPropsRef;
  const { goBack } = props.navigation;

  const [{ music }, { toggleMusic }] = useSettings(['music']);

  useEffect(() => {
    if (!music) return;
    toggleMusic();
    return () => {
      toggleMusic();
    }
  }, []);

  useEffect(() => {
    let player: CreateAudioResult | null = null;
    playAudio(
      require('assets/sounds/twelvebars.mp3'),
      res => { player = res; },
      { isMuted: false, isLooping: true }
    );
    return () => {
      if (player) player.sound.stopAsync();
    }
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= openingMessageText.length) {
        clearInterval(interval);
        Animated.timing(anim, {
          toValue: 0,
          easing: Easing.linear,
          duration: 1000,
          useNativeDriver: true,
        }).start();
        return;
      }
      setOpeningMessage(openingMessageText[index++]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = useCallback(() => goBack(), [goBack]);

  const handleCoinPress = (index?: number) => {
    propsRef.current.onCoinPress(index);
    setRefresh(new Date());
  };

  const handleSetCoinsFound = (coinsFound?: Set<number>) => {
    propsRef.current.setCoinsFound(coinsFound);
    setRefresh(new Date());
  }

  if (propsRef.current.coinsFound.size === 12) handleBack();

  return (
    <ScreenContainer>
      <LevelContainer>
        <LevelRedLight
          {...propsRef.current}
          onCoinPress={handleCoinPress}
          setCoinsFound={handleSetCoinsFound}
        />
      </LevelContainer>
      <CloseTouchable onPress={handleBack}>
        <CloseIcon />
      </CloseTouchable>
      <Taunt1Container>
        <LevelText>{taunt1}</LevelText>
      </Taunt1Container>
      <Taunt2Container>
        <LevelText fontSize={styles.coinSize * 2}>{taunt2}</LevelText>
      </Taunt2Container>
      <Taunt3Container>
        <LevelText fontSize={styles.coinSize * 2.5}>{taunt3}</LevelText>
      </Taunt3Container>
      <OpeningContainer style={{ opacity: anim }}>
        <LevelText color={colors.lightText}>{openingMessage}</LevelText>
      </OpeningContainer>
    </ScreenContainer>
  );
};

export default FakeAd;
