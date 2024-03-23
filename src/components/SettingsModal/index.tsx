import React, { FunctionComponent, useCallback } from 'react';
import { Button } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import useSettings from 'hooks/useSettings';
import { clearSettings } from 'utils/settings';
import getDimensions from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelText from 'components/LevelText';
import { NUM_LEVELS } from 'res/constants';
import {
  settingsButtonSize,
  SettingsText,
  SwitchableSetting,
  ResumeIcon,
  ReplayIcon,
  LevelSelectIcon,
  MusicIcon,
  SfxIcon,
  ColorblindIcon,
  LevelNavContainer,
  LevelNavText,
  LevelNavLeft,
  LevelNavRight,
} from './components';

const { width: windowWidth, height: windowHeight } = getDimensions();

interface SettingsModalProps {
  onClose: () => any;
  title?: string;
  visible?: boolean;
  onRestart?: () => any;
  onGoToLevelSelect?: () => any;
  level?: number;
  onPrevLevel?: () => any;
  onNextLevel?: () => any;
  children?: React.ReactNode;
}

const FullScreenModal = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: #000000e0;
  width: 100%;
  /* ${windowWidth}px; */
  height: ${windowHeight}px;
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

const ScrollContainer = styled.ScrollView`
  width: 100%;
  height: 100%;
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
  underlayColor: colors.foregroundPressed,
})`
  width: ${settingsButtonSize}px;
  height: ${settingsButtonSize}px;
  border-radius: ${settingsButtonSize / 2}px;
  background-color: ${colors.foreground};
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.onPress ? 1 : 0.5)};
  margin-bottom: ${subtitleTextSize}px;
`;

const voidReturn = (f: Function) => () => {
  f();
};

const SettingsModal: FunctionComponent<SettingsModalProps> = (props) => {
  const {
    onClose,
    title,
    visible,
    onGoToLevelSelect,
    onRestart,
    children,
    level,
    onPrevLevel,
    onNextLevel,
  } = props;
  const [
    { music, sfx, colorblind, levelStatus },
    { toggleMusic, toggleSfx, toggleColorblind, completeLevel },
  ] = useSettings();

  const handleToggleMusic = useCallback(voidReturn(toggleMusic), [toggleMusic]);
  const handleToggleSfx = useCallback(voidReturn(toggleSfx), [toggleSfx]);
  const handleToggleColorblind = useCallback(voidReturn(toggleColorblind), [
    toggleColorblind,
  ]);

  if (!visible) return null;

  const handlePassAllLevels = () => {
    for (let i = 1; i <= NUM_LEVELS; i++) completeLevel(i);
  };

  return (
    <FullScreenModal>
      <ScrollContainer>
        <SettingsTitleContainer>
          {level !== undefined ? (
            <LevelNavContainer>
              <LevelNavLeft
                onPress={onPrevLevel}
                disabled={!levelStatus[level - 2]?.unlocked}
              />
              <LevelNavText>{level}</LevelNavText>
              <LevelNavRight
                onPress={onNextLevel}
                disabled={!levelStatus[level]?.unlocked}
              />
            </LevelNavContainer>
          ) : (
            title && <LevelText color={colors.lightText}>{title}</LevelText>
          )}
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
          value={music}
          icon={MusicIcon}
          label={'Music'}
          onValueChange={handleToggleMusic}
        />
        <SwitchableSetting
          value={sfx}
          icon={SfxIcon}
          label={'Sound effects'}
          onValueChange={handleToggleSfx}
        />
        <SwitchableSetting
          value={colorblind}
          icon={ColorblindIcon}
          label={'Color blind mode'}
          onValueChange={handleToggleColorblind}
        />
        {children}
        {__DEV__ && (
          <>
            <LevelText> </LevelText>
            <Button title={'Clear settings'} onPress={clearSettings} />
            <LevelText> </LevelText>
            <Button title={'Pass all levels'} onPress={handlePassAllLevels} />
            <LevelText> </LevelText>
          </>
        )}
      </ScrollContainer>
    </FullScreenModal>
  );
};

export default SettingsModal;
