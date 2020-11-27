import React, { useState, useEffect, useRef } from 'react';
import { Button, View } from 'react-native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const LevelRedLight: Level = (props) => {
  const [redLight, setRedLight] = useState(false);

  const hintMessage = useRef('Easy as pie');

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const blinkCoins = useRef<any>(null);
  useEffect(() => {
    if (twelve) {
      if (blinkCoins.current) clearInterval(blinkCoins.current);
      blinkCoins.current = null;
    } else if (!blinkCoins.current) {
      blinkCoins.current = setInterval(() => {
        hintMessage.current = 'Easy as pie?';
        setRedLight(state => !state);
      }, 1000);
    }
    return () => {
      if (blinkCoins.current) clearInterval(blinkCoins.current);
    };
  }, [twelve]);

  const handleCoinPress = (index: number) => {
    if (redLight) {
      props.setCoinsFound(new Set<number>());
    } else {
      props.onCoinPress(index);
    }
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>{hintMessage.current}</LevelText>
      {coinPositions.map((_, index: number) => (
        <View
          key={String(index)}
          style={{
            position: 'absolute',
            ...coinPositions[index]
          }}
        >
          <Coin
            color={redLight ? colors.badCoin : colors.coin}
            found={props.coinsFound.has(index)}
            onPress={() => handleCoinPress(index)}
          />
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelRedLight;
