import React, { useState, useEffect } from 'react';
import { Alert, Animated, Easing, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import DeviceShake from 'utils/DeviceShake';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const ColaImage = styled.Image.attrs({
  source: require('assets/images/cola.png'),
  resizeMode: 'contain',
})`
  width: ${levelWidth / 2};
  height: ${levelWidth * 5 / 6};
`;

const LevelSodaShake: Level = (props) => {

  const [shake] = useState(new Animated.Value(-1));
  const [shakeFactor] = useState(new Animated.Value(0));
  const [coinsRevealed, setCoinsRevealed] = useState(false);

  useEffect(() => {
    let numShakes = 0;
    const listener = DeviceShake.addListener(() => {
      shakeFactor.setValue(numShakes++ / 6);
      if (numShakes === 12) setCoinsRevealed(true);
    });
    return () => DeviceShake.removeSubscription(listener);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shake, {
          toValue: 1,
          duration: 1000 / 24,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shake, {
          toValue: -1,
          duration: 1000 / 24,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <Animated.View style={{ transform: [
        { translateX: Animated.multiply(shake, shakeFactor) },
      ]}}>
        <ColaImage />
      </Animated.View>
      {coinsRevealed && coinPositions.map((coinPosition, index) => (
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
    </LevelContainer>
  );
};

export default LevelSodaShake;
