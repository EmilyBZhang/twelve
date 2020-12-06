import React, { FunctionComponent, memo } from 'react';
import { Button } from 'react-native';
import styled from 'styled-components/native';

import useCongratsMessage from 'hooks/useCongratsMessage';
import getDimensions from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelText from './LevelText';
import { LargeVictoryButton, LargeVictoryButtonText } from './LargeVictoryButton';

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

interface BubbleTouchableProps {
  backgroundColor?: string;
  size?: number;
}

const BubbleTouchable = styled.TouchableHighlight<BubbleTouchableProps>`
  background-color: ${props => props.backgroundColor || colors.background};
  width: ${props => props.size !== undefined ? props.size : windowWidth / 2}px;
  border-radius: ${props => props.size !== undefined ? props.size / 2 : windowWidth / 4}px;
  justify-content: center;
  align-items: center;
`;

interface BubbleProps {
  backgroundColor: string;
  underlayColor: string;
  color: string;
  title: string;
  onPress?: () => any;
}

const Bubble: FunctionComponent<BubbleProps> = (props) => {
  const { backgroundColor, underlayColor, color, title, onPress } = props;

  return (
    <BubbleTouchable
      backgroundColor={backgroundColor}
      underlayColor={underlayColor}
    >
      <LevelText>{title}</LevelText>
    </BubbleTouchable>
  );
};

const WinModal: FunctionComponent<WinModalProps> = (props) => {
  const congratsMessage = useCongratsMessage([props.level]);

  if (!props.visible) return null;

  return (
    <FullScreenModal>
      <LevelText>{congratsMessage}</LevelText>
      {/* <Bubble title={congratsMessage}>{congratsMessage}</Bubble> */}
      <LargeVictoryButton onPress={props.onNextLevel}>
        <LargeVictoryButtonText>Next level!</LargeVictoryButtonText>
      </LargeVictoryButton>
    </FullScreenModal>
  );
};

export default memo(WinModal);
