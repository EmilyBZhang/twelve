// TODO: change the prop for level to be going to the next level instead

import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Alert, Animated, AsyncStorage, FlatList, StatusBar, View, Text } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { NavigationActions } from 'react-navigation';

import { Screen, Level as LevelType } from 'utils/interfaces';
import useSelectedIndices from 'hooks/useSelectedIndices';
import playAudio from 'utils/playAudio';
import { playCoinSound } from 'utils/playPitch';
import colors from 'assets/colors';

import LevelNav from 'components/LevelNav';
import LevelSelect from './levels/LevelSelect';
import Level1 from './levels/Level1';
import Level2 from './levels/Level2';
import Level3 from './levels/Level3';
import Level4 from './levels/Level4';
import Level5 from './levels/Level5';
import Level6 from './levels/Level6';

const heaven = require('assets/sounds/heaven.mp3');

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
    playCoinSound(coinsFound);
    toggleIndex(index);
  };

  const handleSetCoinsFound = (indices: Set<number>) => {
    setSelectedIndices(indices);
  };
  
  const goToLevel = (index: number) => {
    setSelectedIndices(new Set<number>());
    props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'Level',
      params: {
        level: index
      }
    }));
  };

  const goToMainMenu = () => {
    props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'MainMenu'
    }));
  };

  const handleNextLevel = () => {
    goToLevel(levelNum + 1);
  };

  const levelNum = props.navigation.getParam('level') || 0;
  const levels = [
    LevelSelect,
    Level1,
    Level2,
    Level3,
    Level4,
    Level5,
    Level6
  ];
  if (levelNum === 0 || levelNum >= levels.length) {
    return (
      <>
        <LevelNav
          onBack={goToMainMenu}
          onOpenSettings={() => Alert.alert(String(`Settings don't work yet, dawg`))}
        />
        <LevelSelect
          numLevels={levels.length - 1}
          onGoToLevel={goToLevel}
        />
      </>
    );
  }

  const LevelX = levels[levelNum] as LevelType;

  return (
    <>
      <LevelNav
        onBack={() => goToLevel(0)}
        onOpenSettings={() => Alert.alert(String(`Settings don't work yet, dawg, even if you're on level ${levelNum}`))}
      />
      <LevelX
        coinsFound={selectedIndices}
        onCoinPress={handleCoinPress}
        setCoinsFound={handleSetCoinsFound}
        onNextLevel={handleNextLevel}
      />
    </>
  );
};

export default Level;
