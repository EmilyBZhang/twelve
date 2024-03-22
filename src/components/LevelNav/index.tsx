import React, {
  FunctionComponent,
  memo,
  useEffect,
  useRef,
} from 'react';
import { BackHandler, Alert, NativeEventSubscription, Platform } from 'react-native';
import { AntDesign, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import colors from 'res/colors';
import styles from 'res/styles';
import {
  TopText,
  NavButton,
  LeftContainer,
  RightContainer,
  CenterContainer,
  SettingsIcon,
  HintIcon,
} from './components';
import SettingsModal from 'components/SettingsModal';
import HintModal from 'components/HintModal';
import useSettings from 'hooks/useSettings';
import { HAS_NOTCH } from 'res/constants';

interface LevelNavProps {
  onBack: () => any;
  settingsOpen?: boolean;
  hintOpen?: boolean;
  onToggleSettings?: () => any;
  onPrevLevel?: () => any;
  onNextLevel?: () => any;
  onRestart?: () => any;
  onGoToLevelSelect?: () => any;
  onHint?: () => any;
  level?: number;
  // TODO: Consider removing settingsTitle
  settingsTitle?: string;
}

// TODO: Add the level number to the middle of the bar
const LevelNav: FunctionComponent<LevelNavProps> = (props) => {
  const {
    settingsTitle,
    level,
    onPrevLevel,
    onNextLevel,
    onRestart,
    onGoToLevelSelect,
    settingsOpen,
    onToggleSettings,
    onBack,
    onHint,
    hintOpen,
  } = props;

  const { levelStatus } = useSettings(['levelStatus'])[0];

  const backHandler = useRef<NativeEventSubscription | null>(null);

  useEffect(() => {
    backHandler.current = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onToggleSettings ? onToggleSettings() : onBack();
        return true;
      }
    );
    return () => {
      backHandler.current && backHandler.current.remove();
    }
  }, [onBack, settingsOpen]);

  return (
    <>
      {onHint && (level !== undefined) && (
        <HintModal
          visible={hintOpen}
          level={level}
          onClose={onHint}
          onNextLevel={onNextLevel}
        />
      )}
      {onToggleSettings && (
        <SettingsModal
          visible={settingsOpen}
          title={settingsTitle}
          onClose={onToggleSettings}
          onRestart={onRestart}
          onGoToLevelSelect={onGoToLevelSelect}
          level={level}
          onNextLevel={onNextLevel}
          onPrevLevel={onPrevLevel}
        />
      )}
      <CenterContainer>
        {!HAS_NOTCH && !!level && (
          <>
            <NavButton onPress={onPrevLevel} disabled={!levelStatus[level - 2]?.unlocked}>
              <Octicons
                name={'chevron-left'}
                size={styles.levelNavHeight * 7/12}
                color={colors.foreground}
              />
            </NavButton>
            <TopText>{level}</TopText>
            <NavButton onPress={onNextLevel} disabled={!levelStatus[level]?.unlocked}>
              <Octicons
                name={'chevron-right'}
                size={styles.levelNavHeight * 7/12}
                color={colors.foreground}
              />
            </NavButton>
          </>
        )}
      </CenterContainer>
      <LeftContainer>
        {onToggleSettings ? (
          <NavButton onPress={onToggleSettings} outlined>
            <SettingsIcon />
          </NavButton>
        ) : (
          <NavButton onPress={onBack} outlined>
            <AntDesign
              name={'caretleft'}
              // TODO: import size from somewhere
              size={styles.levelNavHeight * 7/12}
              color={colors.foreground}
            />
          </NavButton>
        )}
        {HAS_NOTCH && !!level && <TopText>{level}</TopText>}
      </LeftContainer>
      <RightContainer>
        {onHint && (
          <NavButton onPress={onHint} outlined>
            <HintIcon />
          </NavButton>
        )}
      </RightContainer>
      {/* <LeftContainer>
        <NavButton onPress={onBack} outlined>
          <AntDesign
            name={'caretleft'}
            size={styles.levelNavHeight * 7/12}
            color={colors.foreground}
          />
        </NavButton>
      </LeftContainer>
      <RightContainer>
        <NavButton onPress={onToggleSettings} outlined>
          <SettingsIcon />
        </NavButton>
      </RightContainer> */}
    </>
  );
};

export default memo(LevelNav);
