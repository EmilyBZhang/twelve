import React, { FunctionComponent, memo } from 'react';
import styled from 'styled-components/native';

import { getLevelDimensions } from 'utils/getDimensions';
import LevelText from 'components/LevelText';

interface CalendarProps {
  numCompleted: number;
}

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const calendarSize = levelWidth * 3 / 4;
const numRows = 4;
const numCols = 3;

const daysPerMonth = [
  31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
];

const CalendarContainer = styled.View`
  width: ${calendarSize + 1}px;
  height: ${calendarSize + 1}px;
  border-color: black;
  border-style: solid;
  border-top-width: 1px;
  border-left-width: 1px;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  flex-direction: row;
`;

const CalendarCell = styled.View`
  width: ${calendarSize / numCols}px;
  height: ${calendarSize / numRows}px;
  border-color: black;
  border-style: solid;
  border-bottom-width: 1px;
  border-right-width: 1px;
`;

const Calendar: FunctionComponent<CalendarProps> = (props) => {
  const { numCompleted } = props;
  
  return (
    <CalendarContainer>
      {daysPerMonth.map((days, index) => (
        <CalendarCell key={String(index)}>
          {(index < numCompleted) && <LevelText>{days}</LevelText>}
        </CalendarCell>
      ))}
    </CalendarContainer>
  );
};

export default memo(Calendar);
