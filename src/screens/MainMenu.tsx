// TODO: Move playAudio to a separate component which will be included in App.tsx
// This should be done after user settings are stored and the useSettings hook is made

import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { NavigationActions } from 'react-navigation';

import { Screen } from '../utils/interfaces';
import playAudio from '../utils/playAudio';
import colors from '../assets/colors';
import ScreenContainer from '../components/ScreenContainer';

const { width, height } = Dimensions.get('window');
const imageHeight = width * 81 / 790;
const titleHeightInit = (height + imageHeight) / 2;
const titleHeightEnd = imageHeight * 4;

interface TitleContainerProps {
  height: Animated.Value;
}

interface MenuButtonProps {
  playButton?: boolean;
}

interface MenuButtonTextProps {
  playButton?: boolean;
}

const TitleContainer = styled(Animated.View).attrs((props: TitleContainerProps) => {
  height: props.height
})`
  width: ${width}px;
  justify-content: flex-end;
`;

const TitleImage = styled.Image.attrs({
  source: require('../assets/images/twelve-padded-title.png'),
  resizeMode: 'contain'
})`
  width: ${width};
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
  width: ${width / 2};
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
  left: boolean;
}

const CornerButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  background-color: ${colors.foreground};
  border: 1px solid ${colors.foreground};
  position: absolute;
  ${(props: CornerButtonProps) => props.left ? 'left: 8' : 'right: 8'}px;
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

const bgMusic = require('../assets/sounds/heatleybros.mp3');

// TODO: fix props
const MainMenu: Screen = (props) => {
  const [titleHeightAnim] = useState(new Animated.Value(titleHeightInit));
  const [menuOpacityAnim] = useState(new Animated.Value(0));

  const musicPlayback = useRef<any>(null);
  const [muted, setMuted] = useState(true); // Use AsyncStorage to save this preference

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleHeightAnim, {
        toValue: titleHeightEnd,
        duration: 2000,
      }),
      Animated.timing(menuOpacityAnim, {
        toValue: 1,
        duration: 2000,
      })
    ]).start();
    const options = {
      shouldPlay: true,
      isLooping: true,
      isMuted: muted
    };
    const setMusicPlayback = (playback: any) => musicPlayback.current = playback;
    playAudio(bgMusic, setMusicPlayback, options);
  }, []);

  const handleMutePress = () => {
    setMuted(state => {
      if (musicPlayback.current) {
        musicPlayback.current.sound.setIsMutedAsync(!state)
          .catch((err: any) => console.warn(err));
      }
      return !state;
    })
  };

  return (
    <ScreenContainer style={{justifyContent: 'flex-start'}}>
      <StatusBar hidden />
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
          onPress={() => alert(`Nobody`)}
        >
          <MenuButtonText>CREDITS</MenuButtonText>
        </MenuButton>
        <MenuButton
          onPress={() => alert(`I'm glad you want to share the nothing that is on this app`)}
        >
          <MenuButtonText>SHARE</MenuButtonText>
        </MenuButton>
        <CornerButton
          left
          onPress={() => alert(`You think a game should have settings? HA HA HA`)}
        >
          <Octicons name='gear' size={24} color='white' />
        </CornerButton>
        <CornerButton
          left={false}
          onPress={handleMutePress}
        >
          <Octicons name={muted ? 'mute' : 'unmute'} size={24} color='white' />
        </CornerButton>
      </MenuButtons>
    </ScreenContainer>
  );
};

export default MainMenu;
