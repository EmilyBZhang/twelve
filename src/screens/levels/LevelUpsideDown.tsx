// TODO: For devices without DeviceMotion enabled, there should be an option
//       to rotate the screen 180 degrees by pinching and rotating the screen
import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const UpsideDownContainer = styled.View`
  flex: 1;
  transform: rotate(180deg) translateY(${styles.levelNavHeight}px);
`;

const LevelUpsideDown: Level = (props) => {
  const [opacity, setOpacity] = useState(0);
  const [opacityAnim] = useState(new Animated.Value(opacity));

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  useEffect(() => {
    if (twelve) return;
    const listener = opacityAnim.addListener(({ value }) => setOpacity(value));
    DeviceMotion.setUpdateInterval(1000 / 12);
    const subscription = DeviceMotion.addListener(res => {
      if (res.rotation) {
        const opacity = Math.max(0, -res.rotation.beta / Math.PI * 2);
        Animated.event(
          [{opacity: opacityAnim}])({opacity},
          {useNativeDriver: true}
        );
      }
    });
    return () => {
      subscription.remove();
      opacityAnim.removeListener(listener);
    };
  }, [twelve]);

  return (
    <UpsideDownContainer>
      <LevelContainer>
        <LevelCounter count={numCoinsFound} />
        <LevelText hidden={twelve}>twelve</LevelText>
        {!twelve && coinPositions.map((coinPosition, index: number) => (
          <Animated.View
            key={String(index)}
            style={{
              position: 'absolute',
              opacity: opacityAnim,
              ...coinPosition
            }}
          >
            <Coin
              found={props.coinsFound.has(index) || opacity === 0}
              onPress={() => props.onCoinPress(index)}
            />
          </Animated.View>
        ))}
      </LevelContainer>
    </UpsideDownContainer>
  );
};

export default LevelUpsideDown;
