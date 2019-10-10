import React, { useState, useEffect } from 'react';
import { Animated, Button, Dimensions, View } from 'react-native';

import { Level } from '../../utils/interfaces';
import getCongratsMessage from '../../utils/getCongratsMessage';
import ScreenContainer from '../../components/ScreenContainer';
import Coin from '../../components/Coin';
import LevelText from '../../components/LevelText';
import LevelCounter from '../../components/LevelCounter';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const coinSize = 40;

const Level3: Level = (props) => {
  const [congratsMessage] = useState<string>(() => getCongratsMessage());
  const [coinAnim] = useState(new Animated.Value(-windowWidth));

  useEffect(() => {
    Animated.loop(
      Animated.timing(coinAnim, {
        toValue: windowWidth,
        duration: 10000,
      })
    ).start();
  }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const deltaX = windowWidth / 3;
  const deltaY = windowHeight / 5;
  const initY = deltaY - coinSize / 2;

  const positions = Array(12).fill(null).map((_, index: number) => {
    const rowIndex = Math.floor(index / 3);
    const xVal = Animated.add(coinAnim, (deltaX * (index % 3)));
    const xProp = (rowIndex % 2 === 0) ? {left: xVal} : {right: xVal};
    return {
      ...xProp,
      top: initY + deltaY * rowIndex
    };
  });

  return (
    <ScreenContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText>
        {twelve ? congratsMessage : 'Can you catch them?'}
      </LevelText>
      {(twelve && props.onGoToLevel) && (
        <Button
          title='Next level!'
          onPress={() => props.onGoToLevel!(4)}
        />
      )}
      {Array(12).fill(null).map((_, index: number) => (
        <Animated.View style={{position: 'absolute', ...positions[index]}} key={String(index)}>
          <Coin
            size={coinSize}
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </Animated.View>
      ))}
    </ScreenContainer>
  );
};

export default Level3;
