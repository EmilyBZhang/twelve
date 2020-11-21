import React, {
  FunctionComponent,
  memo,
  useEffect,
  useRef,
} from 'react';
import { BackHandler, Alert, NativeEventSubscription } from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons';

import colors from 'res/colors';
import styles from 'res/styles';
import {
  TopText,
  NavButton,
  LeftContainer,
  RightContainer,
  CenterContainer,
} from './components';
import SettingsModal from 'components/SettingsModal';

interface LevelNavProps {
  settingsOpen: boolean;
  onToggleSettings: () => any;
  onBack: () => any;
  onPrevLevel?: () => any;
  onNextLevel?: () => any;
  onRestartLevel?: () => any;
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
    onRestartLevel,
    settingsOpen,
    onToggleSettings,
    onBack
  } = props;

  const backHandler = useRef<NativeEventSubscription | null>(null);

  useEffect(() => {
    backHandler.current = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        settingsOpen ? onToggleSettings() : onBack();
        return true;
      }
    );
    return () => {
      backHandler.current && backHandler.current.remove();
    }
  }, [onBack, settingsOpen]);

  return (
    <>
      <SettingsModal
        visible={settingsOpen}
        title={settingsTitle}
        onClose={onToggleSettings}
        onNextLevel={onNextLevel}
        onRestartLevel={onRestartLevel}
      />
      <CenterContainer>
        {!!level && (
          <>
            <NavButton onPress={onPrevLevel}>
              <Octicons
                name={'chevron-left'}
                size={styles.levelNavHeight * 7/12}
                color={colors.foreground}
              />
            </NavButton>
            <TopText>{level}</TopText>
            <NavButton onPress={onNextLevel}>
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
          <Octicons
            name={'gear'}
            size={styles.levelNavHeight * 7/12}
            color={colors.foreground}
          />
        </NavButton>
      </RightContainer>
    </>
  );
};

export default memo(LevelNav);
