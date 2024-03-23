// TODO: Move playAudio to a separate component which will be included in App.tsx
// This should be done after user settings are stored and the useSettings hook is made

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, BackHandler, Share, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { StackActions } from '@react-navigation/native';

import useSettings from 'hooks/useSettings';
import { Screen } from 'utils/interfaces';
import getDimensions from 'utils/getDimensions';
import playAudio, { CreateAudioResult } from 'utils/playAudio';
import colors from 'res/colors';
import styles from 'res/styles';
import strings from 'res/strings';
import ScreenContainer from 'components/ScreenContainer';
import SettingsModal from 'components/SettingsModal';
import FallingCoins from 'components/FallingCoins';

const { width: windowWidth, height: windowHeight } = getDimensions();
const titleSize = windowWidth / 6;

const MainContainer = styled(Animated.View)`
  flex: 1;
  width: 100%;
  flex-direction: column;
  justify-content: flex-end;
`;

interface MenuButtonProps {
  playButton?: boolean;
  selectLevelButton?: boolean;
}

interface MenuButtonTextProps {
  playButton?: boolean;
  selectLevelButton?: boolean;
}

const TwelveTitle = styled.Text.attrs({
  children: 'twelve',
})`
  font-size: ${titleSize}px;
  font-family: montserrat-black;
  text-align: center;
  width: 100%;
  color: ${colors.foreground};
`;

const cornerButtonSize = styles.coinSize * 1.25;

const MenuButtons = styled(Animated.View)`
  justify-content: center;
  /* padding-top: 20%; */
  align-items: center;
  width: 100%;
  height: 75%;
  /* background-color: purple; */
  padding-bottom: ${cornerButtonSize}px;
`;

const MenuButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed,
})<MenuButtonProps>`
  width: ${windowWidth / 2}px;
  height: ${(props: MenuButtonProps) =>
    styles.coinSize *
    (props.playButton ? 11 / 6 : props.selectLevelButton ? 1.25 : 13 / 12)}px;
  padding: 0px ${styles.coinSize / 4}px;
  background-color: ${colors.foreground};
  border: 1px solid ${colors.foreground};
  border-radius: ${styles.coinSize}px;
  margin: ${styles.coinSize / 5}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const MenuButtonText = styled.Text<MenuButtonTextProps>`
  font-size: ${(props: MenuButtonTextProps) =>
    styles.coinSize *
    (props.playButton ? 2 / 3 : props.selectLevelButton ? 0.5 : 5 / 12)}px;
  font-family: montserrat;
  text-align: center;
  color: ${colors.lightText};
`;

const CornerButtons = styled(Animated.View)`
  position: absolute;
  bottom: 0px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

const CornerButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed,
})`
  background-color: ${colors.foreground};
  border: 1px solid ${colors.foreground};
  margin: ${cornerButtonSize / 4}px;
  width: ${cornerButtonSize}px;
  height: ${cornerButtonSize}px;
  border-radius: ${cornerButtonSize / 2}px;
  justify-content: center;
  align-items: center;
`;

// TODO: Make goToLevel a util function
const goToLevel = (index: number) =>
  StackActions.push('Level', { level: index });

const goToCredits = () => StackActions.push('Credits');

const bgMusic = require('assets/music/groovy.mp3');

// TODO: fix props
const MainMenu: Screen = (props) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [screenActive, setScreenActive] = useState(true);
  const [menuOpacityAnim] = useState(new Animated.Value(0));

  const musicPlayback = useRef<CreateAudioResult | null>(null);

  const [
    { music, sfx, settingsReady, levelStatus },
    { toggleMusic, toggleSfx },
  ] = useSettings();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (settingsOpen) {
          setSettingsOpen(false);
          return true;
        }
        return false;
      }
    );
    return backHandler.remove;
  }, [settingsOpen]);

  useEffect(() => {
    Animated.timing(menuOpacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!settingsReady) return;
    if (musicPlayback.current) {
      musicPlayback.current.sound
        .setIsMutedAsync(!music)
        .catch((err: any) => console.warn(err));
    } else if (musicPlayback.current === null) {
      const options = {
        shouldPlay: true,
        isLooping: true,
        isMuted: !music,
      };
      const setMusicPlayback = (playback: any) =>
        (musicPlayback.current = playback);
      playAudio(bgMusic, setMusicPlayback, options);
    }
  }, [music, settingsReady]);

  const handlePlayPress = useCallback(() => {
    setScreenActive(false);
    let firstNotComplete = 1;
    for (let i = 0; i < levelStatus.length; ++i) {
      const level = levelStatus[i];
      if (!level.completed && level.unlocked) {
        firstNotComplete = i + 1;
        break;
      }
    }
    props.navigation.dispatch(goToLevel(firstNotComplete));
  }, []);

  const handleSelectLevelPress = useCallback(() => {
    // setScreenActive(false);
    props.navigation.dispatch(goToLevel(0));
  }, []);

  const handleCreditsPress = useCallback(() => {
    // setScreenActive(false);
    props.navigation.dispatch(goToCredits());
  }, []);

  const handleRemoveAdsPress = useCallback(() => {
    Alert.alert(
      'Coming soon!',
      `Twelve only shows ads for hints and skipping levels.\n\nWe're working on a No Ads bundle to remove ads for these too!`
    );
  }, []);

  const handleToggleSettings = useCallback(() => {
    setSettingsOpen((state) => !state);
  }, []);

  const handleShare = useCallback(() => {
    const numLevelsCompleted = levelStatus.reduce(
      (accum, level) => accum + (level.completed ? 1 : 0),
      0
    );
    Share.share({
      title: 'Try Twelve!',
      message: strings.generateShareMessage(numLevelsCompleted),
      url: 'https://expo.io/@bradonzhang/twelve',
    });
  }, []);

  return (
    <ScreenContainer style={{ justifyContent: 'flex-start' }}>
      <SettingsModal
        title={'Main Menu'}
        visible={settingsOpen}
        onClose={handleToggleSettings}
      />
      <View style={{ position: 'absolute', top: 0, left: 0 }}>
        <FallingCoins active={screenActive} />
      </View>
      <MainContainer style={{ opacity: menuOpacityAnim }}>
        <TwelveTitle />
        <MenuButtons>
          <MenuButton playButton onPress={handlePlayPress}>
            <>
              <MaterialCommunityIcons
                name={'play'}
                size={styles.coinSize}
                color={colors.lightText}
              />
              <MenuButtonText playButton>PLAY</MenuButtonText>
            </>
          </MenuButton>
          <MenuButton selectLevelButton onPress={handleSelectLevelPress}>
            <MenuButtonText>SELECT LEVEL</MenuButtonText>
          </MenuButton>
          <MenuButton onPress={handleCreditsPress}>
            <MenuButtonText>CREDITS</MenuButtonText>
          </MenuButton>
          <MenuButton onPress={handleRemoveAdsPress}>
            <>
              <MaterialCommunityIcons
                name={'cancel'}
                size={styles.coinSize / 2}
                color={colors.lightText}
              />
              <MenuButtonText> REMOVE ADS</MenuButtonText>
            </>
          </MenuButton>
        </MenuButtons>
      </MainContainer>
      <CornerButtons>
        <CornerButton onPress={handleToggleSettings}>
          <MaterialCommunityIcons
            name={'cog'}
            size={(cornerButtonSize * 2) / 3}
            color={colors.lightText}
          />
        </CornerButton>
        <CornerButton onPress={handleShare}>
          <MaterialCommunityIcons
            name={'share-variant'}
            size={(cornerButtonSize * 2) / 3}
            color={colors.lightText}
          />
        </CornerButton>
      </CornerButtons>
    </ScreenContainer>
  );
};

export default MainMenu;
