import React, { FunctionComponent } from 'react';
import { Text, Modal, View, TouchableOpacity, Button } from 'react-native';
import styled from 'styled-components/native';

import { resetSettings } from 'utils/settings';
import getDimensions from 'utils/getDimensions';
import styles from 'assets/styles';

const { width: screenWidth, height: screenHeight } = getDimensions();

interface SettingsModalProps {
  onClose: () => any;
  visible?: boolean;
  onNextLevel?: () => any;
}

const FullScreenModal = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  backgroundColor: #00000080;
  width: ${screenWidth}px;
  height: ${screenHeight}px;
  margin: 0px;
  z-index: ${styles.levelNavZIndex + 1};
  justify-content: center;
  align-items: center;
`;

const SettingsModal: FunctionComponent<SettingsModalProps> = (props) => {
  if (!props.visible) return null;
  return (
    <FullScreenModal>
      <TouchableOpacity
        onPress={() => props.onClose()}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Text style={{color: 'white', textAlign: 'center'}}>
          So uh... funny story. Settings don't work yet.{'\n\n'}
          Press anywhere to close this important message.{'\n\n'}
        </Text>
        {props.onNextLevel && (
          <Button title={'Skip level'} onPress={props.onNextLevel} />
        )}
        <Button title={'Reset settings'} onPress={() => {resetSettings}} />
      </TouchableOpacity>
    </FullScreenModal>
  );
};

export default SettingsModal;
