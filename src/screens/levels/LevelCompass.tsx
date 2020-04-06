import React, { useState, useEffect } from 'react';
import { Animated, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

import { Level } from 'utils/interfaces';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import Compass, { compassSize, compassRadius } from './components/LevelCompass/Compass';

const coinSize = compassSize * 13 / 144;
const coinPositions = Array.from(Array(12), (_, index) => {
  const rad = Math.PI * 2 * index / 12;
  const R = compassRadius - coinSize / 2;
  return ({
    top: R * (1 - Math.cos(rad)),
    left: R * (1 + Math.sin(rad))
  });
});

const LevelCompass: Level = (props) => {

  const [direction, setDirection] = useState(0);
  const [directionAnim] = useState(new Animated.Value(direction));
  const rotation = directionAnim.interpolate({
    inputRange: [-Math.PI, Math.PI],
    outputRange: ['-180deg', '180deg'],
  });

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  useEffect(() => {
    if (twelve) return;
    const listener = directionAnim.addListener(({ value }) => setDirection(value));
    DeviceMotion.setUpdateInterval(1000 / 60);
    const subscription = DeviceMotion.addListener(res => {
      if (res.rotation) {
        const rotation = res.rotation.alpha;
        Animated.event([{rotation: directionAnim}])(
          {rotation},
          {useNativeDriver: true}
        );
      }
    });
    return () => {
      subscription.remove();
      directionAnim.removeListener(listener);
    };
  }, [twelve]);

  // useEffect(() => {
  //   let rotation = 0;
  //   setInterval(() => {
  //     rotation += Math.PI / 6;
  //     Animated.event([{rotation: directionAnim}])(
  //       {rotation},
  //       {useNativeDriver: true}
  //     );
  //   }, 1000);
  // }, []);

  const handleCoinPress = (index: number) => {
    const dangerRange = false;
    const goodRange = true;
    if (dangerRange || props.coinsFound.has(index)) {
      props.setCoinsFound(new Set<number>());
    } else if (goodRange) {
      props.onCoinPress(index);
    }
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <Compass rotation={rotation}>
        {coinPositions.map((coinPosition, index) => (
          <View
            key={String(index)}
            style={{position: 'absolute', ...coinPosition}}
          >
            <Coin
              size={coinSize}
              color={props.coinsFound.has(index) ? (
                  colors.badCoin
                ) : (
                  colors.selectCoin
              )}
              found={twelve}
              onPress={() => handleCoinPress(index)}
            />
          </View>
        ))}
      </Compass>
    </LevelContainer>
  );
};

export default LevelCompass;
