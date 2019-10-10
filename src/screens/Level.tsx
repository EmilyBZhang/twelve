import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, StatusBar, View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { NavigationActions } from 'react-navigation';

import { Screen, Level as LevelType } from '../utils/interfaces';
import useSelectedIndices from '../hooks/useSelectedIndices';
import playAudio from '../utils/playAudio';
import playBell from '../utils/playBell';
import colors from '../assets/colors';

import LevelSelect from './levels/LevelSelect';
import Level1 from './levels/Level1';
import Level2 from './levels/Level2';
import Level3 from './levels/Level3';
import Level4 from './levels/Level4';

const heaven = require('../assets/sounds/heaven.mp3');

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

// TODO: Fix Screen type
const Level: Screen = (props) => {
  const [selectedIndices, toggleIndex, setSelectedIndices] = useSelectedIndices();
  const musicPlayback = useRef<any>(null);

  const coinsFound = selectedIndices.size;
  const twelve = coinsFound === 12;

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
    playBell(coinsFound);
    toggleIndex(index);
  };

  const handleSetCoinsFound = (indices: Set<number>) => {
    setSelectedIndices(indices);
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
    Level2,
    Level3,
    Level4,
  ];
  if (levelNum === 0) {
    return (
      <LevelSelect
        numLevels={levels.length - 1}
        onGoToLevel={handleNextLevel}
      />
    )
  }

  const LevelX = levels[levelNum] as LevelType;

  return (
    <LevelX
      coinsFound={selectedIndices}
      onCoinPress={handleCoinPress}
      setCoinsFound={handleSetCoinsFound}
      onGoToLevel={handleNextLevel}
    />
  );
};

export default Level;
