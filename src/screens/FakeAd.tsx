// TODO: Make credits screen scroll slowly to the bottom
// IDEA: Make the links at the bottom of the credits each contained inside of a Coin

import React, { useState, useCallback, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Screen, LevelProps } from 'utils/interfaces';
import styles from 'res/styles';
import colors from 'res/colors';
import ScreenContainer from 'components/ScreenContainer';
import useSettings from 'hooks/useSettings';
import playAudio, { CreateAudioResult } from 'utils/playAudio';
import LevelCatchCoins from './levels/LevelCatchCoins';

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

type LevelPropsRef = React.MutableRefObject<React.PropsWithChildren<LevelProps>>;

const FakeAd: Screen = (props) => {
  const [refresh, setRefresh] = useState(new Date());

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

  const handleBack = useCallback(() => goBack(), [goBack]);

  const handleCoinPress = (index?: number) => {
    propsRef.current.onCoinPress(index);
    setRefresh(new Date());
  };

  if (propsRef.current.coinsFound.size === 12) handleBack();

  return (
    <ScreenContainer>
      <LevelCatchCoins
        {...propsRef.current}
        onCoinPress={handleCoinPress}
      />
      <CloseTouchable onPress={handleBack}>
        <CloseIcon />
      </CloseTouchable>
    </ScreenContainer>
  );
};

export default FakeAd;
