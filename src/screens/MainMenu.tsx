// TODO: Move playAudio to a separate component which will be included in App.tsx
// This should be done after user settings are stored and the useSettings hook is made

import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Alert, AsyncStorage, Animated } from 'react-native';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { NavigationActions } from 'react-navigation';

import { setSetting, getSetting } from 'utils/settings';
import { Screen } from 'utils/interfaces';
import getDimensions from 'utils/getDimensions';
import playAudio from 'utils/playAudio';
// import useSettings from 'hooks/useSettings';
import colors from 'assets/colors';
import ScreenContainer from 'components/ScreenContainer';

const { width: windowWidth, height: windowHeight } = getDimensions();
const imageHeight = windowWidth * 81 / 790;
const titleHeightInit = (windowHeight + imageHeight) / 2;
const titleHeightEnd = imageHeight * 4;

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

const TitleImage = styled.Image.attrs({
  source: require('assets/images/twelve-padded-title.png'),
  resizeMode: 'contain'
})`
  width: ${windowWidth};
  height: ${imageHeight};
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
      `left: ${8 + props.left * 48}`
    ) : (
      `right: ${8 + props.right! * 48}`
  )}px;
  bottom: 8px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`

// TODO: Make goToLevel a util function
const goToLevel = (index: number) => NavigationActions.navigate({
  routeName: 'Level',
  params: {
    level: index
  }
});

const bgMusic = require('assets/sounds/twelvebars.mp3');

// TODO: fix props
const MainMenu: Screen = (props) => {
  const [titleHeightAnim] = useState(new Animated.Value(titleHeightInit));
  const [menuOpacityAnim] = useState(new Animated.Value(0));
  // TODO: Fix the corner buttons
  const [cornerOpacityAnim] = useState(new Animated.Value(0));

  const musicPlayback = useRef<any>(null);
  const [mutedMusic, setMutedMusic] = useState<boolean>(getSetting('musicMuted')); // Use AsyncStorage to save this preference
  const [mutedSfx, setMutedSfx] = useState<boolean>(getSetting('sfxMuted')); // Use AsyncStorage to save this preference

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
          useNativeDriver: true
        }),
        Animated.timing(cornerOpacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
      ]),
    ]).start();
    const options = {
      shouldPlay: true,
      isLooping: true,
      isMuted: mutedMusic
    };
    const setMusicPlayback = (playback: any) => musicPlayback.current = playback;
    playAudio(bgMusic, setMusicPlayback, options);
  }, []);

  const handleMuteMusicPress = () => {
    setSetting('musicMuted', !mutedMusic);
    setMutedMusic(state => {
      if (musicPlayback.current) {
        musicPlayback.current.sound.setIsMutedAsync(!state)
          .catch((err: any) => console.warn(err));
      }
      return !state;
    });
  };

  const handleMuteSfxPress = () => {
    Alert.alert('No SFX', 'This button was meant to disable SFX. Not done yet, obviously.');
    setSetting('sfxMuted', !mutedSfx);
    setMutedSfx(state => !state);
  };

  return (
    <ScreenContainer style={{justifyContent: 'flex-start'}}>
      <TitleContainer style={{height: titleHeightAnim}}>
        <TitleImage />
      </TitleContainer>
      <MenuButtons
        style={{opacity: menuOpacityAnim}}
      >
        <MenuButton
          playButton
          onPress={() => props.navigation.dispatch(goToLevel(1))}
        >
          <MenuButtonText playButton>PLAY</MenuButtonText>
        </MenuButton>
        <MenuButton
          onPress={() => props.navigation.dispatch(goToLevel(0))}
        >
          <MenuButtonText>SELECT LEVEL</MenuButtonText>
        </MenuButton>
        <MenuButton
          onPress={() => Alert.alert('Credits', 'Nobody\n\n*WHEEZE*')}
        >
          <MenuButtonText>CREDITS</MenuButtonText>
        </MenuButton>
        <CornerButton
          left={0}
          onPress={() => Alert.alert('Settings', `You think a game should have settings?\n\nHA HA HA`)}
        >
          <Octicons name={'gear'} size={24} color={'white'} />
        </CornerButton>
        <CornerButton
          left={1}
          onPress={() => Alert.alert('Share twelve', `I'm glad you want to share the nothing that is on this app`)}
        >
          <MaterialCommunityIcons name={'share-variant'} size={24} color={'white'} />
        </CornerButton>
        <CornerButton
          right={1}
          onPress={handleMuteMusicPress}
        >
          <MaterialCommunityIcons name={mutedMusic ? 'music-off' : 'music'} size={24} color={'white'} />
        </CornerButton>
        <CornerButton
          right={0}
          onPress={handleMuteSfxPress}
        >
          <Octicons name={mutedSfx ? 'mute' : 'unmute'} size={24} color={'white'} />
        </CornerButton>
      </MenuButtons>
    </ScreenContainer>
  );
};

export default MainMenu;
