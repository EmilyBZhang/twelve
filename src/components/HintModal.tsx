import React, { FunctionComponent, memo, useState } from 'react';
import { Button } from 'react-native';
import hints from 'res/hints.json';
import styled from 'styled-components/native';

import colors from 'res/colors';
import styles from 'res/styles';

interface HintModalProps {
  level: number;
  hintNum: number;
  visible: boolean;
  onClose: () => any;
}

const FullScreenModal = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: #ffffffe0;
  width: 100%;
  height: 100%;
  margin: 0px;
  z-index: ${styles.levelNavZIndex + 1};
  justify-content: center;
  align-items: center;
`;

const HintText = styled.Text`
  font-family: montserrat;
  font-size: ${styles.coinSize}px;
  color: ${colors.darkText};
`;

// TODO: IDEA: Light modal on black background
const HintModal: FunctionComponent<HintModalProps> = (props) => {
  const { level, hintNum, visible, onClose } = props;
  
  if (!visible) return null;

  const levelHints = hints[level - 1];
  const hint = levelHints ? levelHints[hintNum % levelHints.length] : undefined;

  return (
    <FullScreenModal>
      <HintText>{hint}</HintText>
      <Button title={'Close'} onPress={onClose} />
    </FullScreenModal>
  );
};

export default HintModal;
