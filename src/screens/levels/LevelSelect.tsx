import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Animated, Button, Dimensions, FlatList, StatusBar, View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Level } from '../../utils/interfaces';
import colors from '../../assets/colors';
import ScreenContainer from '../../components/ScreenContainer';
import Coin from '../../components/Coin';
import LevelText from '../../components/LevelText';
import LevelCounter from '../../components/LevelCounter';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

interface LevelSelectProps {
  numLevels: number;
  onGoToLevel: (index: number) => any;
}

const TitleText = styled.Text`
  font-size: 36px;
  font-weight: 900;
  text-align: center;
  padding-vertical: 64px;
  color: ${colors.foreground};
`;

const levelBoxSize = windowWidth / 5;
const levelBoxMargin = levelBoxSize / 5;

const LevelBoxContainer = styled.View`
  margin-left: ${levelBoxMargin}px;
  margin-bottom: ${levelBoxMargin}px;
`;

const LevelBoxTouchable = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  width: ${levelBoxSize}px;
  height: ${levelBoxSize}px;
  background-color: ${colors.foreground};
  justify-content: center;
  align-items: center;
`;

const LevelBoxText = styled.Text`
  color: white;
  text-align: center;
  font-size: 36px;
`;

const levelListStyle = {
  width: windowWidth
};

// TODO: Consider using one Level component which takes in a level number as a navigation param
// TODO: Make a Level interface, subinterface of FunctionComponent
const LevelSelect: FunctionComponent<LevelSelectProps> = (props) => {
  const levels = Array(props.numLevels).fill(null)
    .map((_, index: number) => index + 1);

  return (
    <ScreenContainer>
      <FlatList
        data={levels}
        numColumns={4}
        horizontal={false}
        keyExtractor={(level) => String(level)}
        contentContainerStyle={levelListStyle}
        ListHeaderComponent={
          <TitleText>Select Level</TitleText>
        }
        renderItem={({ item: level }) => (
          <LevelBoxContainer>
            <LevelBoxTouchable
              onPress={() => props.onGoToLevel(level)}
            >
              <LevelBoxText>{level}</LevelBoxText>
            </LevelBoxTouchable>
          </LevelBoxContainer>
        )}
      />
    </ScreenContainer>
  );
};

export default LevelSelect;
