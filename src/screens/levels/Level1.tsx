import React, { FunctionComponent, useState } from 'react';
import { Animated, Button, Dimensions, FlatList, StatusBar, View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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

// TODO: Consider using one Level component which takes in a level number as a navigation param
// TODO: Make a Level interface, subinterface of FunctionComponent
const Level1: Level = (props) => {
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

  return (
    <ScreenContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText>
        {twelve ? congratsMessage : 'twelve'}
      </LevelText>
      {(twelve && props.onGoToLevel) && (
        <Button
          title='Next level!'
          onPress={() => props.onGoToLevel!(2)}
        />
      )}
      {Array(12).fill(null).map((_, index: number) => (
        <View style={{position: 'absolute', ...positions[index]}} key={String(index)}>
          <Coin
            size={40}
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
    </ScreenContainer>
  );
};

export default Level1;
