import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, StatusBar, View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { NavigationActions } from 'react-navigation';

import { Screen, Level as LevelType } from '../utils/interfaces';
import useSelectedIndices from '../hooks/useSelectedIndices';
import playAudio from '../utils/playAudio';
import colors from '../assets/colors';
import ScreenContainer from '../components/ScreenContainer';
import Coin from '../components/Coin';

import LevelSelect from './levels/LevelSelect';
import Level1 from './levels/Level1';
import Level2 from './levels/Level2';

const coinSounds = [
  require(`../assets/sounds/bells/G4.mp3`),
  require(`../assets/sounds/bells/Ab4.mp3`),
  require(`../assets/sounds/bells/A4.mp3`),
  require(`../assets/sounds/bells/Bb4.mp3`),
  require(`../assets/sounds/bells/B4.mp3`),
  require(`../assets/sounds/bells/C5.mp3`),
  require(`../assets/sounds/bells/Db5.mp3`),
  require(`../assets/sounds/bells/D5.mp3`),
  require(`../assets/sounds/bells/Eb5.mp3`),
  require(`../assets/sounds/bells/E5.mp3`),
  require(`../assets/sounds/bells/F5.mp3`),
  require(`../assets/sounds/bells/Gb5.mp3`)
];
const heaven = require('../assets/sounds/heaven.mp3');

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

// TODO: Consider using one Level component which takes in a level number as a navigation param
const Level: Screen = (props) => {
  const [selectedIndices, toggleIndex, setSelectedIndices] = useSelectedIndices();
  const musicPlayback = useRef<any>(null);

  const coinsFound = selectedIndices.size;
  const twelve = coinsFound == 12;

  useEffect(() => {
    if (twelve) {
      playAudio(heaven, (playback) => musicPlayback.current = playback);
      return () => {
        if (musicPlayback.current) {
          musicPlayback.current.sound.stopAsync()
            .catch((err: any) => console.warn(err));
        }
      }
    }
  }, [twelve]);

  const handleCoinPress = (index: number) => {
    toggleIndex(index);
    playAudio(coinSounds[coinsFound]);
  };
  
  const handleNextLevel = (index: number) => {
    setSelectedIndices(new Set<number>());
    props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'Level',
      params: {
        level: index
      }
    }));
  };

  const levelNum = props.navigation.getParam('level') || 0;
  const levels = [
    LevelSelect,
    Level1,
    Level2
  ];
  if (levelNum == 0) {
    return (
      <LevelSelect
        numLevels={levels.length - 1}
        onGoToLevel={handleNextLevel}
      />
    )
  }

  const LevelX = levels[levelNum] as FunctionComponent<LevelType>;

  return (
    <LevelX
      coinsFound={selectedIndices}
      onCoinPress={handleCoinPress}
      onGoToLevel={handleNextLevel}
    />
  );
};

export default Level;
