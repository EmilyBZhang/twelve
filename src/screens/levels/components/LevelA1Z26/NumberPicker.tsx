import React, { FunctionComponent, memo, useState, useRef } from 'react';
import { AntDesign } from '@expo/vector-icons';
import styled from 'styled-components/native';

import styles from 'res/styles';
import Coin from 'components/Coin';

interface NumberPickerProps {
  count: number;
  onChange: (direction: 'up' | 'down') => any;
  onCoin1Press?: () => any;
  onCoin2Press?: () => any;
}

const numberPickerWidth = styles.coinSize;
const displayWidth = numberPickerWidth;
const displayHeight = displayWidth;
const numberPickerHeight = displayWidth + displayHeight + numberPickerWidth * 2;

const NumberPickerContainer = styled.View`
  width: ${numberPickerWidth}px;
  height: ${numberPickerHeight}px;
  justify-content: center;
  align-items: center;
`;

const DisplayContainer = styled.View`
  background-color: whitesmoke;
  width: ${displayWidth}px;
  height: ${displayHeight}px;
  justify-content: center;
  align-items: center;
`;

const DisplayText = styled.Text`
  font-size: ${styles.coinSize / 2}px;
  font-family: montserrat;
`;

interface DisplayProps {
  count: number;
}

const Display: FunctionComponent<DisplayProps> = (props) => {
  const { count } = props;
  return (
    <DisplayContainer>
      <DisplayText>{count}</DisplayText>
    </DisplayContainer>
  );
};

const UpArrow = styled(AntDesign).attrs({
  name: 'caretup',
  size: numberPickerWidth,
  color: 'black'
})``;

const DownArrow = styled(AntDesign).attrs({
  name: 'caretdown',
  size: numberPickerWidth,
  color: 'black'
})``;;

const ArrowTouchable = styled.TouchableOpacity``;

interface ArrowButtonProps {
  direction: 'up' | 'down';
  onChange: () => any;
  onCoinPress?: () => any;
}

const CoinContainer = styled.View`
  position: absolute;
`;

const ArrowButton: FunctionComponent<ArrowButtonProps> = (props) => {
  const { direction, onChange, onCoinPress } = props;
  const Arrow = direction === 'up' ? UpArrow : DownArrow;

  const [coinPressed, setCoinPressed] = useState(false);
  const pressInterval = useRef<number | null>(null);

  const handlePressIn = () => {
    pressInterval.current = null;
    onChange();
  };

  const handleLongPress = () => {
    pressInterval.current = setInterval(() => {
      onChange();
    }, 1000 / 12);
  };

  const handlePressOut = () => {
    if (pressInterval.current !== null) clearInterval(pressInterval.current);
    pressInterval.current = null;
  };

  const handleCoinPress = () => {
    if (!onCoinPress) return;
    setCoinPressed(true);
    onCoinPress();
  };

  return (
    <ArrowTouchable
      disabled={!!onCoinPress}
      onPressIn={handlePressIn}
      onLongPress={handleLongPress}
      onPressOut={handlePressOut}
    >
      <Arrow />
      {onCoinPress && (
        <CoinContainer>
          <Coin
            found={coinPressed}
            onPress={handleCoinPress}
          />
        </CoinContainer>
      )}
    </ArrowTouchable>
  )
};

const NumberPicker: FunctionComponent<NumberPickerProps> = (props) => {
  const { count, onChange, onCoin1Press, onCoin2Press } = props;

  return (
    <NumberPickerContainer>
      <ArrowButton
        direction={'up'}
        onChange={() => onChange('up')}
        onCoinPress={onCoin1Press}
      />
      <Display
        count={count}
      />
      <ArrowButton
        direction={'down'}
        onChange={() => onChange('down')}
        onCoinPress={onCoin2Press}
      />
    </NumberPickerContainer>
  );
};

export default memo(NumberPicker);
