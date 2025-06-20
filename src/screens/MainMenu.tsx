// TODO: Move playAudio to a separate component which will be included in App.tsx
// This should be done after user settings are stored and the useSettings hook is made

import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, BackHandler, Share, View, Text } from 'react-native';
import { MaterialCommunityIcons, Octicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { NavigationActions } from 'react-navigation';
import { Audio } from 'expo-av';

import useSettings from 'hooks/useSettings';
import { Screen } from 'utils/interfaces';
import getDimensions, { getFullDimensions } from 'utils/getDimensions';
import playAudio, { CreateAudioResult } from 'utils/playAudio';
import colors from 'res/colors';
import styles from 'res/styles';
import strings from 'res/strings';
import ScreenContainer from 'components/ScreenContainer';
import MuteMusicIcon from 'components/icons/MuteMusicIcon';
import MuteSfxIcon from 'components/icons/MuteSfxIcon';
import SettingsModal from 'components/SettingsModal';
import FallingCoins from 'components/FallingCoins';

const { width: windowWidth, height: windowHeight } = getDimensions();
const titleSize = windowWidth / 6;

const largeButtonSize = styles.coinSize * 3.5;
const mediumButtonSize = styles.coinSize * 2.5;
const smallButtonSize = styles.coinSize * 1.5;

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
  children: 'twelve'
})`
  font-size: ${titleSize}px;
  font-family: montserrat-black;
  text-align: center;
  width: 100%;
  color: ${colors.foreground};
`;

const PlayButtonContainer = styled.View`
  width: ${largeButtonSize}px;
  height: ${largeButtonSize}px;
  border-radius: ${largeButtonSize / 2}px;
  background-color: ${colors.foreground};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CircularButtonRow = styled.View`
  flex-direction: row;
`;

const MediumButton = styled.View`
  width: ${mediumButtonSize}px;
  height: ${mediumButtonSize}px;
  border-radius: ${mediumButtonSize / 2}px;
  background-color: ${colors.foreground};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SmallButton = styled.View`
  width: ${smallButtonSize}px;
  height: ${smallButtonSize}px;
  border-radius: ${smallButtonSize / 2}px;
  background-color: ${colors.foreground};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PlayIcon = styled(MaterialIcons).attrs({
  name: 'play-arrow',
  size: largeButtonSize / 2,
  color: colors.lightText,
})`
  transform: scale(1.5, 1.5);
`;

const AdIcon = styled(FontAwesome5).attrs({
  name: 'ad',
  size: smallButtonSize / 4,
  color: colors.lightText,
})`
  position: absolute;
`;

const CancelIcon = styled(MaterialCommunityIcons).attrs({
  name: 'block-helper',
  size: smallButtonSize / 2,
  color: colors.lightText
})`
  position: absolute;
`;

const SettingsIcon = styled(MaterialCommunityIcons).attrs({
  name: 'cog',
  size: mediumButtonSize / 2,
  color: colors.lightText,
})``;

const LevelSelectIcon = styled(MaterialCommunityIcons).attrs({
  name: 'view-grid',
  size: mediumButtonSize / 2,
  color: colors.lightText,
})``;

const CreditsIcon = styled(MaterialCommunityIcons).attrs({
  name: 'information-outline',
  size: smallButtonSize / 2,
  color: colors.lightText,
})``;

const PlayText = styled.Text`
  font-family: montserrat;
  font-size: ${largeButtonSize / 6}px;
  color: ${colors.lightText};
  width: 100%;
  text-align: center;
`;

const MediumButtonText = styled.Text`
  font-family: montserrat;
  font-size: ${mediumButtonSize / 8}px;
  color: ${colors.lightText};
  width: 100%;
  text-align: center;
`;

const SmallButtonText = styled.Text`
  font-family: montserrat;
  font-size: ${smallButtonSize / 6}px;
  color: ${colors.lightText};
  width: 100%;
  text-align: center;
`;

const PlayButton: FunctionComponent = () => (
  <PlayButtonContainer>
    <PlayIcon />
    <PlayText>play</PlayText>
  </PlayButtonContainer>
);

const NoAdsButton: FunctionComponent = () => (
  <SmallButton>
    <SmallButtonText>ads</SmallButtonText>
    <CancelIcon />
  </SmallButton>
);

const SettingsButton: FunctionComponent = () => (
  <MediumButton>
    <SettingsIcon />
    <MediumButtonText>settings</MediumButtonText>
  </MediumButton>
);

const LevelSelectButton: FunctionComponent = () => (
  <MediumButton>
    <LevelSelectIcon />
    <MediumButtonText>levels</MediumButtonText>
  </MediumButton>
);

const CreditsButton: FunctionComponent = () => (
  <SmallButton>
    <CreditsIcon />
  </SmallButton>
);

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
  underlayColor: colors.foregroundPressed
})`
  width: ${windowWidth / 2}px;
  height: ${(props: MenuButtonProps) => (
    styles.coinSize * (props.playButton ? 11/6 : props.selectLevelButton ? 1.25 : 13/12)
  )}px;
  padding: 0px ${styles.coinSize / 4}px;
  background-color: ${colors.foreground};
  border: 1px solid ${colors.foreground};
  border-radius: ${styles.coinSize}px;
  margin: ${styles.coinSize / 5}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const MenuButtonText = styled.Text`
  font-size: ${(props: MenuButtonTextProps) => (
    styles.coinSize * (props.playButton ? 2/3 : props.selectLevelButton ? 0.5 : 5/12)
  )}px;
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
  underlayColor: colors.foregroundPressed
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
const goToLevel = (index: number) => NavigationActions.navigate({
  routeName: 'Level',
  params: {
    level: index
  }
});

const goToCredits = () => NavigationActions.navigate({
  routeName: 'Credits'
});

const bgMusic = require('assets/music/groovy.mp3');

// TODO: fix props
const MainMenu: Screen = (props) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [screenActive, setScreenActive] = useState(true);
  const [menuOpacityAnim] = useState(new Animated.Value(0));

  const musicPlayback = useRef<CreateAudioResult | null>(null);

  const [
    { music, sfx, settingsReady, levelStatus },
    { toggleMusic, toggleSfx }
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
      musicPlayback.current.sound.setIsMutedAsync(!music)
        .catch((err: any) => console.warn(err));
    } else if (musicPlayback.current === null) {
      const options = {
        shouldPlay: true,
        isLooping: true,
        isMuted: !music
      };
      const setMusicPlayback = (playback: any) => musicPlayback.current = playback;
      playAudio(bgMusic, setMusicPlayback, options);
    }
  }, [music, settingsReady]);

  // TODO: Delete this; it's testing code
  // useEffect(() => {
  //   (async () => {
  //     const { sound, status } = await Audio.Sound.createAsync(require('assets/music/groovy.mp3'));
  //     sound.playFromPositionAsync(4000);
  //     setInterval(() => {
  //       sound.playFromPositionAsync(4000);
  //     }, 1000);
  //   })();
  // }, []);

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
        title={'Main Menu'}
        visible={settingsOpen}
        onClose={handleToggleSettings}
      />
      <View style={{position: 'absolute', top: 0, left: 0}}>
        <FallingCoins active={screenActive} />
      </View>
      <MainContainer style={{ opacity: menuOpacityAnim }}>
        <TwelveTitle />
        <MenuButtons>
          <MenuButton
            playButton
            onPress={handlePlayPress}
          >
            <>
              <MaterialCommunityIcons name={'play'} size={styles.coinSize} color={colors.lightText} />
              <MenuButtonText playButton>PLAY</MenuButtonText>
            </>
          </MenuButton>
          <MenuButton
            selectLevelButton
            onPress={handleSelectLevelPress}
          >
            <MenuButtonText>SELECT LEVEL</MenuButtonText>
          </MenuButton>
          <MenuButton
            onPress={handleCreditsPress}
          >
            <MenuButtonText>CREDITS</MenuButtonText>
          </MenuButton>
          <MenuButton
            onPress={handleRemoveAdsPress}
          >
            <>
              <MaterialCommunityIcons name={'cancel'} size={styles.coinSize / 2} color={colors.lightText} />
              <MenuButtonText>  REMOVE ADS</MenuButtonText>
            </>
          </MenuButton>
        </MenuButtons>
      </MainContainer>
      <CornerButtons>
        <CornerButton
          onPress={handleToggleSettings}
        >
          <MaterialCommunityIcons
            name={'cog'}
            size={cornerButtonSize * 2/3}
            color={colors.lightText}
          />
        </CornerButton>
        <CornerButton
          onPress={handleShare}
        >
        <MaterialCommunityIcons
          name={'share-variant'}
          size={cornerButtonSize * 2/3}
          color={colors.lightText}
        />
        </CornerButton>
      </CornerButtons>
    </ScreenContainer>
  );
};

export default MainMenu;
