import React, { useState, useEffect } from 'react';
import { Animated, Button, View } from 'react-native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import getCongratsMessage from 'utils/getCongratsMessage';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const deltaX = levelWidth / 3;
const deltaY = levelHeight / 5;
const initY = deltaY - styles.coinSize / 2;

const Level3: Level = (props) => {
  const [congratsMessage] = useState<string>(() => getCongratsMessage());
  const [coinAnim] = useState(new Animated.Value(-levelWidth));

  useEffect(() => {
    Animated.loop(
      Animated.timing(coinAnim, {
        toValue: levelWidth,
        duration: 10000,
      })
    ).start();
  }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

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
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText>
        {twelve ? congratsMessage : 'Can you catch them?'}
      </LevelText>
      {twelve && (
        <Button
          title='Next level!'
          onPress={() => props.onNextLevel()}
        />
      )}
      {Array(12).fill(null).map((_, index: number) => (
        <Animated.View style={{position: 'absolute', ...positions[index]}} key={String(index)}>
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </Animated.View>
      ))}
    </LevelContainer>
  );
};

export default Level3;
