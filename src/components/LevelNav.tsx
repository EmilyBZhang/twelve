import React, {
  FunctionComponent,
  memo,
  useEffect,
  useRef,
  useState
} from 'react';
import { BackHandler, Alert, NativeEventSubscription } from 'react-native';
import styled from 'styled-components/native';
import { AntDesign, Octicons } from '@expo/vector-icons';

import colors from 'assets/colors';
import styles from 'assets/styles';
import SettingsModal from './SettingsModal';

interface LevelNavProps {
  settingsOpen: boolean;
  onToggleSettings: () => any;
  onBack: () => any;
  onNextLevel?: () => any;
  onRestartLevel?: () => any;
  settingsTitle?: string;
}

interface ButtonProps {
  left?: number;
  right?: number;
}

const ButtonContainer = styled.View<ButtonProps>`
  position: absolute;
  top: 0px;
  ${props => (props.left !== undefined) ? (
      `left: ${props.left * styles.levelNavHeight}`
    ) : (
      `right: ${props.right! * styles.levelNavHeight}`
  )}px;
  z-index: 1728;
`;

const TopTouchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5
})`
  margin: 4px;
  padding: 4px;
  height: ${styles.levelNavHeight - 8}px;
  width: ${styles.levelNavHeight - 8}px;
  justify-content: center;
  align-items: center;
  border-radius: ${styles.levelNavHeight}px;
  background-color: #00ffff66;
`;

const LevelNav: FunctionComponent<LevelNavProps> = (props) => {
  const { settingsTitle, settingsOpen, onToggleSettings, onBack } = props;

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
  }, [onBack, settingsOpen])

  return (<>
    <SettingsModal
      visible={settingsOpen}
      title={settingsTitle}
      onClose={onToggleSettings}
      onNextLevel={props.onNextLevel}
      onRestartLevel={props.onRestartLevel}
    />
    <ButtonContainer left={0}>
      <TopTouchable onPress={onBack}>
        <AntDesign name={'caretleft'} size={24} color={colors.foreground} />
      </TopTouchable>
    </ButtonContainer>
    <ButtonContainer right={0}>
      <TopTouchable onPress={onToggleSettings}>
        <Octicons name={'gear'} size={24} color={colors.foreground} />
      </TopTouchable>
    </ButtonContainer>
  </>);
};

export default memo(LevelNav);
