import React, { FunctionComponent } from 'react';
import { Text, Modal, View, TouchableOpacity, Button } from 'react-native';
import styled from 'styled-components/native';

import useSettings from 'hooks/useSettings';
import { clearSettings } from 'utils/settings';
import getDimensions from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelText from 'components/LevelText';
import MuteMusicIcon from 'components/icons/MuteMusicIcon';
import MuteSfxIcon from 'components/icons/MuteSfxIcon';
import ColorblindIcon from 'components/icons/ColorblindIcon';
import { NUM_LEVELS } from 'res/constants';
import {
  settingsButtonSize,
  SettingsText,
  SwitchableSetting,
  ResumeIcon,
  ReplayIcon,
  LevelSelectIcon,
} from './components';

const { width: windowWidth, height: windowHeight } = getDimensions();

interface SettingsModalProps {
  onClose: () => any;
  title?: string;
  visible?: boolean;
  onRestart?: () => any;
  onGoToLevelSelect?: () => any;
}

const FullScreenModal = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: #000000e0;
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
  padding-top: ${styles.levelNavHeight}px;
  align-items: center;
`;

const SettingsButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;
  padding: ${styles.coinSize / 2}px 0px;
`;

const SettingsSquareButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  background-color: ${colors.foreground};
  margin: 8px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const subtitleTextSize = styles.coinSize / 3;

const SubtitleText = styled.Text`
  color: ${colors.lightText};
  font-size: ${subtitleTextSize}px;
  transform: translateY(${(settingsButtonSize + subtitleTextSize) / 2}px);
  position: absolute;
  opacity: 0.75;
  text-align: center;
  width: 100%;
`;

const SettingsButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  width: ${settingsButtonSize}px;
  height: ${settingsButtonSize}px;
  border-radius: ${settingsButtonSize / 2}px;
  background-color: ${colors.foreground};
  justify-content: center;
  align-items: center;
  opacity: ${props => props.onPress ? 1 : 0.5};
  margin-bottom: ${subtitleTextSize}px;
`;

// TODO: Add ScrollView to modal
const SettingsModal: FunctionComponent<SettingsModalProps> = (props) => {
  const { onClose, title, visible, onGoToLevelSelect, onRestart, children } = props;
  const [
    { musicMuted, sfxMuted, colorblind },
    { toggleMusic, toggleSfx, toggleColorblind, completeLevel }
  ] = useSettings();

  if (!visible) return null;

  const handlePassAllLevels = () => {
    for (let i = 1; i <= NUM_LEVELS; i++) completeLevel(i);
  };

  return (
    <FullScreenModal>
      {/* <CloseArea> */}
        <SettingsTitleContainer>
          {title && <LevelText color={colors.lightText}>{title}</LevelText>}
          <SettingsText>Settings</SettingsText>
        </SettingsTitleContainer>
        <SettingsButtonsContainer>
          <SettingsButton onPress={onClose}>
            <>
              <ResumeIcon />
              <SubtitleText>Resume</SubtitleText>
            </>
          </SettingsButton>
          <SettingsButton onPress={onRestart}>
            <>
              <ReplayIcon />
              <SubtitleText>Restart</SubtitleText>
            </>
          </SettingsButton>
          <SettingsButton onPress={onGoToLevelSelect}>
            <>
              <LevelSelectIcon />
              <SubtitleText>Levels</SubtitleText>
            </>
          </SettingsButton>
        </SettingsButtonsContainer>
        <SwitchableSetting
          label={'Music'}
          value={!musicMuted}
          onValueChange={toggleMusic}
        />
        <SwitchableSetting
          label={'Sound effects'}
          value={!sfxMuted}
          onValueChange={toggleSfx}
        />
        <SwitchableSetting
          label={'Colorblind mode'}
          value={colorblind}
          onValueChange={toggleColorblind}
        />
        {children}
        <Button title={'Clear settings'} onPress={clearSettings} />
        <Button title={'Pass all levels'} onPress={handlePassAllLevels} />
      {/* </CloseArea> */}
    </FullScreenModal>
  );
};

export default SettingsModal;
