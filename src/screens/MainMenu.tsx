// TODO: Move playAudio to a separate component which will be included in App.tsx
// This should be done after user settings are stored and the useSettings hook is made

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Share, View } from 'react-native';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { NavigationActions } from 'react-navigation';

import useSettings from 'hooks/useSettings';
import { Screen } from 'utils/interfaces';
import getDimensions from 'utils/getDimensions';
import playAudio from 'utils/playAudio';
import colors from 'assets/colors';
import strings from 'assets/strings';
import ScreenContainer from 'components/ScreenContainer';
import MuteMusicIcon from 'components/icons/MuteMusicIcon';
import MuteSfxIcon from 'components/icons/MuteSfxIcon';
import SettingsModal from 'components/SettingsModal';
import FallingCoins from 'components/FallingCoins';

const { width: windowWidth, height: windowHeight } = getDimensions();
const titleSize = 54;
const initTitleHeight = (windowHeight + titleSize) / 2;
const titleHeightEnd = titleSize * 3;

interface MenuButtonProps {
  playButton?: boolean;
}

interface MenuButtonTextProps {
  playButton?: boolean;
}

const TitleContainer = styled(Animated.View)`
  width: ${windowWidth}px;
  justify-content: flex-end;
`;

const TwelveTitle = styled.Text.attrs({
  children: 'twelve'
})`
  font-size: ${titleSize}px;
  font-family: montserrat-black;
  text-align: center;
  width: 100%;
  color: ${colors.foreground};
`;

const MenuButtons = styled(Animated.View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const MenuButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  width: ${windowWidth / 2};
  height: ${(props: MenuButtonProps) => props.playButton ? 60 : 40}px;
  padding: 8px;
  background-color: ${colors.foreground};
  border: 1px solid ${colors.foreground};
  margin: 8px;
  justify-content: center;
  align-items: center;
`;

const MenuButtonText = styled.Text`
  font-size: ${(props: MenuButtonTextProps) => props.playButton ? 24 : 16}px;
  font-family: montserrat;
  text-align: center;
  color: white;
`;

interface CornerButtonProps {
  left?: number;
  right?: number;
}

const CornerButtons = styled(Animated.View)`
  width: 100%;
`;

const CornerButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  background-color: ${colors.foreground};
  border: 1px solid ${colors.foreground};
  position: absolute;
  ${(props: CornerButtonProps) => props.left !== undefined ? (
      `left: ${8 + props.left * 48}px;`
    ) : (
      `right: ${8 + props.right! * 48}px;`
  )}
  bottom: 8px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

// TODO: Make goToLevel a util function
const goToLevel = (index: number) => NavigationActions.navigate({
  routeName: 'Level',
  params: {
    level: index
  }
});

const goToCredits = () => NavigationActions.navigate({
  routeName: 'Credits'
});

const bgMusic = require('assets/sounds/twelvebars.mp3');

// TODO: fix props
const MainMenu: Screen = (props) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [screenActive, setScreenActive] = useState(true);
  const [titleHeightAnim] = useState(new Animated.Value(initTitleHeight));
  const [menuOpacityAnim] = useState(new Animated.Value(0));
  // TODO: Fix the corner buttons
  const [cornerOpacityAnim] = useState(new Animated.Value(0));

  const musicPlayback = useRef<any>(null);

  const [
    { musicMuted, sfxMuted, settingsReady, levelStatus },
    { toggleMusic, toggleSfx }
  ] = useSettings();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleHeightAnim, {
        toValue: titleHeightEnd,
        duration: 2000,
      }),
      // TODO: Make corner buttons respond to cornerOpacityAnim
      // Then change menuOpacityAnim duration to 1000
      Animated.sequence([
        Animated.timing(menuOpacityAnim, {
          toValue: 1,
          duration: 2000,
          // useNativeDriver: true
        }),
        Animated.timing(cornerOpacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (!settingsReady) return;
    if (musicPlayback.current) {
      musicPlayback.current.sound.setIsMutedAsync(musicMuted)
        .catch((err: any) => console.warn(err));
    } else if (musicPlayback.current === null) {
      const options = {
        shouldPlay: true,
        isLooping: true,
        isMuted: musicMuted
      };
      musicPlayback.current = 0;
      const setMusicPlayback = (playback: any) => musicPlayback.current = playback;
      playAudio(bgMusic, setMusicPlayback, options);
    }
  }, [musicMuted, settingsReady]);

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

  const handleMuteMusicPress = useCallback(() => {
    toggleMusic();
  }, []);

  const handleMuteSfxPress = useCallback(() => {
    toggleSfx();
  }, []);

  const handleToggleSettings = useCallback(() => {
    setSettingsOpen(state => !state);
  }, []);

  const handleShare = useCallback(() => {
    const numLevelsCompleted = levelStatus.reduce(
      (accum, level) => accum + (level.completed ? 1 : 0),
      0
    );
    Share.share({
      title: 'Try Twelve!',
      message: strings.generateShareMessage(numLevelsCompleted),
      url: 'https://expo.io/@bradonzhang/twelve'
    });
  }, []);

  return (
    <ScreenContainer style={{justifyContent: 'flex-start'}}>
      <SettingsModal
        visible={settingsOpen}
        onClose={handleToggleSettings}
      />
      <View style={{position: 'absolute', top: 0, left: 0}}>
        <FallingCoins active={screenActive} />
      </View>
      <TitleContainer style={{height: titleHeightAnim, opacity: menuOpacityAnim}}>
        <TwelveTitle />
      </TitleContainer>
      <MenuButtons
        style={{opacity: menuOpacityAnim}}
      >
        <MenuButton
          playButton
          onPress={handlePlayPress}
        >
          <MenuButtonText playButton>PLAY</MenuButtonText>
        </MenuButton>
        <MenuButton
          onPress={handleSelectLevelPress}
        >
          <MenuButtonText>SELECT LEVEL</MenuButtonText>
        </MenuButton>
        <MenuButton
          onPress={handleCreditsPress}
        >
          <MenuButtonText>CREDITS</MenuButtonText>
        </MenuButton>
        <CornerButton
          left={0}
          onPress={handleToggleSettings}
        >
          <Octicons name={'gear'} size={24} color={'white'} />
        </CornerButton>
        <CornerButton
          left={1}
          onPress={handleShare}
        >
          <MaterialCommunityIcons name={'share-variant'} size={24} color={'white'} />
        </CornerButton>
        <CornerButton
          right={1}
          onPress={handleMuteMusicPress}
          disabled={!settingsReady}
        >
          <MuteMusicIcon muted={musicMuted} />
        </CornerButton>
        <CornerButton
          right={0}
          onPress={handleMuteSfxPress}
        >
          <MuteSfxIcon muted={sfxMuted} />
        </CornerButton>
      </MenuButtons>
    </ScreenContainer>
  );
};

export default MainMenu;
