import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';

import useSettings from 'hooks/useSettings';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'assets/colors';
import ScreenContainer from 'components/ScreenContainer';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

interface LevelSelectProps {
  numLevels: number;
  onGoToLevel: (index: number) => any;
}
export type LevelSelectType = FunctionComponent<LevelSelectProps>;

const TitleText = styled.Text`
  font-size: 36px;
  font-family: montserrat-extra-bold;
  text-align: center;
  padding-vertical: 64px;
  color: ${colors.foreground};
  width: 100%;
`;

const levelBoxSize = levelWidth / 5;
const levelBoxMargin = levelBoxSize / 5;

const LevelBoxContainer = styled.View`
  margin-left: ${levelBoxMargin}px;
  margin-bottom: ${levelBoxMargin}px;
`;

interface LevelBoxProps {
  completed: boolean;
}

const LevelBoxTouchable = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})<LevelBoxProps>`
  width: ${levelBoxSize}px;
  height: ${levelBoxSize}px;
  background-color: ${colors.foreground};
  justify-content: center;
  align-items: center;
  ${props => props.disabled && `opacity: 0.5;`}
  ${props => props.completed && `border: 2px solid gold;`}
`;

const LevelBoxText = styled.Text`
  color: white;
  text-align: center;
  font-size: 36px;
  font-family: montserrat;
`;

const levelListStyle = {
  width: levelWidth
};

const LevelSelect: LevelSelectType = (props) => {
  const [{ levelStatus: levelStatuses }] = useSettings();

  return (
    <ScreenContainer>
      <FlatList
        data={levelStatuses}
        numColumns={4}
        horizontal={false}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={levelListStyle}
        ListHeaderComponent={
          <TitleText>Select Level</TitleText>
        }
        renderItem={({ item: levelStatus, index }) => (
          <LevelBoxContainer>
            <LevelBoxTouchable
              completed={levelStatus.completed}
              disabled={!levelStatus.unlocked}
              onPress={() => props.onGoToLevel(index + 1)}
            >
              <LevelBoxText>{index + 1}</LevelBoxText>
            </LevelBoxTouchable>
          </LevelBoxContainer>
        )}
      />
    </ScreenContainer>
  );
};

export default LevelSelect;
