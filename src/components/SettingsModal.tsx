import React, { FunctionComponent } from 'react';
import { Text, Modal, View, TouchableOpacity, Button } from 'react-native';
import styled from 'styled-components/native';

import levels from 'screens/levels';
import useSettings from 'hooks/useSettings';
import { clearSettings } from 'utils/settings';
import getDimensions from 'utils/getDimensions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelText from 'components/LevelText';
import MuteMusicIcon from 'components/icons/MuteMusicIcon';
import MuteSfxIcon from 'components/icons/MuteSfxIcon';
import ColorblindIcon from 'components/icons/ColorblindIcon';

const { width: windowWidth, height: windowHeight } = getDimensions();

interface SettingsModalProps {
  onClose: () => any;
  title?: string;
  visible?: boolean;
  onNextLevel?: () => any;
  onRestartLevel?: () => any;
}

const FullScreenModal = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: #000000bf;
  width: 100%;
  /* ${windowWidth}px; */
  height: 100%;
  /* ${windowHeight}px; */
  margin: 0px;
  z-index: ${styles.levelNavZIndex + 1};
  justify-content: flex-start;
  align-items: center;
`;

const CloseArea = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
`;

const SettingsTitleContainer = styled.View`
  width: 100%;
  padding-top: 64px;
  padding-bottom: 64px;
  align-items: center;
`;

const SettingsText = styled.Text`
  color: white;
  text-align: center;
  font-size: 24px;
  font-family: montserrat;
  width: 100%;
`;

const SettingsButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;
`;

const SettingsButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  background-color: ${colors.foreground};
  margin: 8px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

// TODO: Add ScrollView to modal
const SettingsModal: FunctionComponent<SettingsModalProps> = (props) => {
  const [
    { musicMuted, sfxMuted, colorblind },
    { toggleMusic, toggleSfx, toggleColorblind, completeLevel }
  ] = useSettings();

  if (!props.visible) return null;

  const handlePassAllLevels = () => {
    levels.forEach((_, index) => index && completeLevel(index));
  };

  return (
    <FullScreenModal>
      <CloseArea onPress={props.onClose}>
        <SettingsTitleContainer>
          {props.title && <LevelText color={'white'}>{props.title}</LevelText>}
          <SettingsText>Settings</SettingsText>
        </SettingsTitleContainer>
        <SettingsButtonsContainer>
          <SettingsButton onPress={toggleMusic}>
            <MuteMusicIcon muted={musicMuted} />
          </SettingsButton>
          <SettingsButton onPress={toggleSfx}>
            <MuteSfxIcon muted={sfxMuted} />
          </SettingsButton>
          <SettingsButton onPress={toggleColorblind}>
            <ColorblindIcon colorblind={colorblind} />
          </SettingsButton>
        </SettingsButtonsContainer>
        <SettingsText>
          {'\n'}Press anywhere to close{'\n'}
        </SettingsText>
        {props.onRestartLevel && (
          <>
            <Button title={'Restart level'} onPress={props.onRestartLevel} />
            <Text>{'\n'}</Text>
          </>
        )}
        {props.onNextLevel && (
          <>
            <Button title={'Skip level'} onPress={props.onNextLevel} />
            <Text>{'\n'}</Text>
          </>
        )}
        <Button title={'Pass all levels'} onPress={handlePassAllLevels} />
        <Button title={'Clear settings'} onPress={clearSettings} />
      </CloseArea>
    </FullScreenModal>
  );
};

export default SettingsModal;
