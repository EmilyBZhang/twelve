import React, { useState, useEffect } from 'react';
import { Animated, Button, Easing, View } from 'react-native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import useCongratsMessage from 'hooks/useCongratsMessage';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const deltaX = levelWidth / 3;
const deltaY = levelHeight / 5;
const initY = deltaY - styles.coinSize / 2;

const LevelCatchCoins: Level = (props) => {
  const [coinAnim] = useState(new Animated.Value(-levelWidth));

  const congratsMessage = useCongratsMessage();

  useEffect(() => {
    Animated.loop(
      Animated.timing(coinAnim, {
        toValue: levelWidth,
        easing: Easing.linear,
        duration: 10000,
      })
    ).start();
  }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const coinPositions = Array.from(Array(12), (_, index: number) => {
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
          title={'Next level!'}
          onPress={() => props.onNextLevel()}
        />
      )}
      {coinPositions.map((coinPosition, index: number) => (
        <Animated.View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </Animated.View>
      ))}
    </LevelContainer>
  );
};

export default LevelCatchCoins;
