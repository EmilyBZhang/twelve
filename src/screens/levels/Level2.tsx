import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, StatusBar, View, Slider, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import Slider from '@react-native-community/slider';
import { Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Level } from '../../utils/interfaces';
import getCongratsMessage from '../../utils/getCongratsMessage';
import colors from '../../assets/colors';
import ScreenContainer from '../../components/ScreenContainer';
import Coin from '../../components/Coin';
import LevelText from '../../components/LevelText';
import LevelCounter from '../../components/LevelCounter';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const ColorSlider = styled.Slider.attrs({
  minimumValue: 0,
  maximumValue: 255,
  minimumTrackTintColor: colors.coin,
  maximumTrackTintColor: colors.background
})`
  width: 100px;
  height: 10px;
  z-index: 1;
  position: absolute;
  top: 100px;
  right: -20px;
  transform: scaleX(2) scaleY(2) rotate(90deg);
`;

// TODO: Consider using one Level component which takes in a level number as a navigation param
// TODO: Make a Level interface, subinterface of FunctionComponent
const Level2: Level = (props) => {
  const [sliderVal, setSliderVal] = useState<number>(0);
  const [congratsMessage] = useState<string>(() => getCongratsMessage());

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound == 12;

  const coinSize = 40;
  const deltaX = windowWidth / 4;
  const deltaY = windowHeight / 5;
  const initX = deltaX - coinSize / 2;
  const initY = deltaY - coinSize / 2;

  const positions = Array(12).fill(null).map((_, index: number) => ({
    left: initX + deltaX * (index % 3),
    top: initY + deltaY * Math.floor(index / 3)
  }));

  const hintText = sliderVal == 255 ? 'There they are!' : `Where'd they go?`;

  return (
    <ScreenContainer color={`rgb(0, ${sliderVal}, 255)`}>
      <ColorSlider
        onValueChange={setSliderVal}
      />
      <LevelCounter
        count={numCoinsFound}
        color={'white'}
      />
      <LevelText color={'white'}>
        {twelve ? congratsMessage : hintText}
      </LevelText>
      {Array(12).fill(null).map((_, index: number) => (
        <View style={{position: 'absolute', ...positions[index]}} key={String(index)}>
          <Coin
            size={40}
            hidden={sliderVal == 0}
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
    </ScreenContainer>
  );
};

export default Level2;
