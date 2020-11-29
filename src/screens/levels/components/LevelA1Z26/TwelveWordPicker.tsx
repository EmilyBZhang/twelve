import React, { memo, FunctionComponent, useState, useRef, useMemo } from 'react';
import styled from 'styled-components/native';

import { getLevelDimensions } from 'utils/getDimensions';
import { arraysEqual } from 'utils/arrays';
import NumberPicker from './NumberPicker';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

interface TwelveWordPickerProps {
  onCoinPress: (index: number) => any;
}

const TwelveWordPickerContainer = styled.View`
  width: ${levelWidth}px;
  flex-direction: row;
  justify-content: space-evenly;
`;

const twelveArray = [20, 23, 5, 12, 22, 5];

const TwelveWordPicker: FunctionComponent<TwelveWordPickerProps> = (props) => {

  const { onCoinPress } = props;

  const [counts, setCounts] = useState(() => twelveArray.map(() => 26));
  const twelveAchieved = useRef(false);

  const handleChange = useMemo(() => {
    return counts.map((count, index) => (direction: 'up' | 'down') => (
      setCounts(counts => [
        ...counts.slice(0, index),
        (counts[index] + 25 + (direction === 'up' ? 1 : -1)) % 26 + 1,
        ...counts.slice(index + 1)
      ])
    ));
  }, []);

  if (!twelveAchieved.current && arraysEqual(counts, twelveArray)) {
    twelveAchieved.current = true;
  }

  return (
    <TwelveWordPickerContainer>
      {counts.map((count, index) => (
        <NumberPicker
          key={String(index)}
          count={count}
          onChange={handleChange[index]}
          onCoin1Press={twelveAchieved.current ? (() => onCoinPress(index)) : undefined}
          onCoin2Press={twelveAchieved.current ? (() => onCoinPress(index + 6)) : undefined}
        />
      ))}
    </TwelveWordPickerContainer>
  );
};

export default memo(TwelveWordPicker);
