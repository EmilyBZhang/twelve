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

import colors from 'res/colors';
import styles from 'res/styles';
import SettingsModal from 'components/SettingsModal';

export const LeftContainer = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  height: ${styles.levelNavHeight}px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  z-index: ${styles.levelNavZIndex};
`;

export const RightContainer = styled.View`
  position: absolute;
  top: 0px;
  right: 0px;
  height: ${styles.levelNavHeight}px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  z-index: ${styles.levelNavZIndex};
`;

export const CenterContainer = styled.View.attrs({ pointerEvents: 'box-none' })`
  position: absolute;
  top: 0px;
  height: ${styles.levelNavHeight}px;
  width: 100%;
  overflow: hidden;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: ${styles.levelNavZIndex};
  background-color: ${colors.background}66;
`;

export const TopText = styled.Text`
  color: ${colors.foreground};
  font-family: montserrat-bold;
  font-size: ${styles.levelNavHeight * 2/3}px;
  text-align: center;
  padding: ${styles.levelNavHeight / 6}px;
  width: ${styles.levelNavHeight * 4/3};
`;

export interface NavButtonProps {
  outlined?: boolean;
}

export const NavButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5
})<NavButtonProps>`
  margin: ${styles.levelNavHeight / 12}px;
  padding: ${styles.levelNavHeight / 12}px;
  height: ${styles.levelNavHeight * 5/6}px;
  width: ${styles.levelNavHeight * 5/6}px;
  justify-content: center;
  align-items: center;
  border-radius: ${styles.levelNavHeight}px;
  opacity: ${props => props.disabled ? 0.5 : 1};
  ${props => props.outlined ? `background-color: ${colors.background}66` : ''};
`;
