import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const buttonSize = styles.coinSize * 3;

const TimerButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed,
})`
  width: ${buttonSize}px;
  height: ${buttonSize}px;
  border-radius: ${buttonSize / 2}px;
  background-color: ${colors.foreground};
`;

const LevelSelfTimer: Level = (props) => {

  const [showCoins, setShowCoins] = useState(false);

  const startTime = useRef<number>(new Date().getTime());
  const numCoinsFound = useRef(props.coinsFound.size);
  numCoinsFound.current = props.coinsFound.size;
  const twelve = numCoinsFound.current === 12;

  const handlePressIn = () => {
    startTime.current = new Date().getTime();
  };

  const handlePressOut = () => {
    const elapsed = new Date().getTime() - startTime.current;
    setShowCoins(true);
    setTimeout(() => {
      if (numCoinsFound.current === 12) return;
      setShowCoins(false);
      props.setCoinsFound(new Set());
    }, elapsed);
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound.current} />
      {showCoins ? (
        <>
          <LevelText hidden={twelve}>twelve</LevelText>
          {coinPositions.map((coinPosition, index) => (
            <View
              key={String(index)}
              style={{position: 'absolute', ...coinPosition}}
            >
              <Coin
                found={props.coinsFound.has(index)}
                onPress={() => props.onCoinPress(index)}
              />
            </View>
          ))}
        </>
      ) : (
        <TimerButton onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <View />
        </TimerButton>
      )}
    </LevelContainer>
  );
};

export default LevelSelfTimer;
