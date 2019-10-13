import React, { FunctionComponent, useEffect, useState } from 'react';
import { BackHandler, Alert } from 'react-native';
import styled from 'styled-components/native';
import { AntDesign, Octicons } from '@expo/vector-icons';

import colors from 'assets/colors';
import styles from 'assets/styles';

interface LevelNavProps {
  onBack: () => any;
  onOpenSettings: () => any;
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
  padding: 8px;
`;

const LevelNav: FunctionComponent<LevelNavProps> = (props) => {
  const [backHandler, setBackHandler] = useState<any>(null);

  useEffect(() => {
    setBackHandler(
      BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          props.onBack();
          return true;
        }
      )
    );
    return () => {
      backHandler && backHandler.remove();
    }
  }, [props.onBack])

  return (
    <>
      <ButtonContainer left={0}>
        <TopTouchable onPress={props.onBack}>
          <AntDesign name='caretleft' size={24} color={colors.foreground} />
        </TopTouchable>
      </ButtonContainer>
      <ButtonContainer right={0}>
        <TopTouchable onPress={props.onOpenSettings}>
          <Octicons name='gear' size={24} color={colors.foreground} />
        </TopTouchable>
      </ButtonContainer>
    </>
  );
};

export default LevelNav;
