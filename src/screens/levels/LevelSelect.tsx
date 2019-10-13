import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { AsyncStorage, FlatList } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'assets/colors';
import ScreenContainer from 'components/ScreenContainer';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

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

const levelBoxSize = levelWidth / 5;
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
  width: levelWidth
};

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
