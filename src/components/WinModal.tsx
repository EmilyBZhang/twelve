import React, { FunctionComponent, memo } from 'react';
import { Text, Modal, View, TouchableOpacity, Button } from 'react-native';
import styled from 'styled-components/native';

import useCongratsMessage from 'hooks/useCongratsMessage';
import getDimensions from 'utils/getDimensions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelText from './LevelText';

const { width: windowWidth, height: windowHeight } = getDimensions();

// TODO: Add restart level functionality after cleaning up UI
interface WinModalProps {
  onNextLevel: () => any;
  level?: number;
  visible?: boolean;
}

// TODO: Consider moving FullScreenModal into its own file
const FullScreenModal = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  padding-top: ${styles.levelNavHeight}px;
  background-color: ${colors.background}80;
  width: 100%;
  /* ${windowWidth}px; */
  height: 100%;
  /* ${windowHeight}px; */
  margin: 0px;
  z-index: ${styles.levelNavZIndex - 1};
  justify-content: center;
  align-items: center;
`;

const WinModal: FunctionComponent<WinModalProps> = (props) => {
  const congratsMessage = useCongratsMessage([props.level]);

  if (!props.visible) return null;

  return (
    <FullScreenModal>
      <LevelText>{congratsMessage}</LevelText>
      <Button title={'Next level!'} onPress={props.onNextLevel} />
    </FullScreenModal>
  );
};

export default memo(WinModal);
