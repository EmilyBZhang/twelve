// TODO: For devices without DeviceMotion enabled, there should be an option
//       to rotate the screen 180 degrees by pinching and rotating the screen
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

type Rotation = DeviceMotionMeasurement['rotation'];

const initRotation = {alpha: 0, beta: 0, gamma: 0};

const UpsideDownContainer = styled.View`
  flex: 1;
  transform: rotate(180deg) translateY(${styles.levelNavHeight}px);
`;

const LevelUpsideDown: Level = (props) => {
  const [rotationData, setRotationData] = useState<Rotation>(initRotation);
  
  const { alpha, beta, gamma } = rotationData;

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  useEffect(() => {
    if (twelve) return;
    DeviceMotion.setUpdateInterval(1000 / 12);
    const subscription = DeviceMotion.addListener(res => {
      console.log(res.rotation);
      if (res.rotation) setRotationData(res.rotation);
    });
    return subscription.remove;
  }, [twelve]);

  return (
    <UpsideDownContainer>
      <LevelContainer>
        <LevelCounter count={numCoinsFound} />
        <LevelText hidden={twelve}>twelve</LevelText>
        {!twelve && coinPositions.map((coinPosition, index: number) => (
          <View
            key={String(index)}
            style={{position: 'absolute', opacity: Math.max(0, -beta / Math.PI * 2), ...coinPosition}}
          >
            <Coin
              found={props.coinsFound.has(index) || beta >= 0}
              onPress={() => props.onCoinPress(index)}
            />
          </View>
        ))}
      </LevelContainer>
    </UpsideDownContainer>
  );
};

export default LevelUpsideDown;
