import React, { FunctionComponent, memo } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { getLevelDimensions } from 'utils/getDimensions';
import LevelText from 'components/LevelText';
import colors from 'res/colors';

interface CalendarProps {
  numCompleted: number;
}

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const calendarSize = (levelWidth * 3) / 4;
const numRows = 4;
const numCols = 3;
const rowSize = calendarSize / numRows;
const colSize = calendarSize / numCols;

const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const CalendarContainer = styled.View`
  width: ${calendarSize + colSize / 2}px;
  height: ${calendarSize + rowSize}px;
  border-color: black;
  border-style: solid;
  border-top-width: ${(rowSize * 1) / 4}px;
  padding-top: ${rowSize / 2}px;
  border-left-width: ${colSize / 4}px;
  border-right-width: ${colSize / 4}px;
  border-bottom-width: ${rowSize / 4}px;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  flex-direction: row;
  background-color: ${colors.coin};
`;

const CalendarCell = styled.View`
  width: ${colSize}px;
  height: ${rowSize}px;
  border-color: black;
  border-style: solid;
  border-top-width: 1px;
  border-right-width: 1px;
  border-radius: 1px;
  background-color: white;
  opacity: ${5 / 6};
`;

const Calendar: FunctionComponent<CalendarProps> = (props) => {
  const { numCompleted } = props;

  return (
    <CalendarContainer>
      {daysPerMonth.map((days, index) => (
        <CalendarCell key={String(index)}>
          {index < numCompleted && <LevelText>{days}</LevelText>}
        </CalendarCell>
      ))}
    </CalendarContainer>
    // <FontAwesome size={levelWidth} name={'calendar'} color={'black'} />
  );
};

export default memo(Calendar);
