import React, { useState, useEffect, FunctionComponent } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';

import { getLevelDimensions } from 'utils/getDimensions';
import playAudio from 'utils/playAudio';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

export const sodaWidth = levelWidth / 2;
export const sodaHeight = levelWidth * 5 / 6;

export const SodaImage = styled.Image.attrs({
  source: require('assets/images/can-closed.png'),
  resizeMode: 'contain',
  fadeDuration: 0,
})`
  width: ${sodaWidth};
  height: ${sodaHeight};
`;

export const SodaImageOpened = styled.Image.attrs({
  source: require('assets/images/can-open.png'),
  resizeMode: 'contain',
})`
  position: absolute;
  width: ${sodaWidth};
  height: ${sodaHeight};
`;

interface SodaProps {
  opened: boolean;
  shakeFactor: Animated.Value;
}

export const Soda: FunctionComponent<SodaProps> = (props) => {
  const { shakeFactor, opened } = props;

  const [shake] = useState(new Animated.Value(-1));

  useEffect(() => {
    if (!opened) return;
    playAudio(require('assets/sfx/can.mp3'));
  }, [opened]);

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

  return (
    <Animated.View style={{ transform: [
      { translateX: Animated.multiply(shake, shakeFactor) },
    ]}}>
      <SodaImage />
      {opened && <SodaImageOpened />}
    </Animated.View>
  );
};

export default Soda;
