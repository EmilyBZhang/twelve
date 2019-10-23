// TODO: See if other things could useCallback/useMemo to optimize renders of memo components

import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AsyncStorage, FlatList } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { NavigationActions } from 'react-navigation';
import { useDispatch } from 'react-redux';

import { completeLevel } from 'reducers/settings/actions'
import { Screen, Level as LevelType } from 'utils/interfaces';
import useSelectedIndices from 'hooks/useSelectedIndices';
import playAudio from 'utils/playAudio';
import { playCoinSound } from 'utils/playPitch';
import colors from 'assets/colors';

import LevelNav from 'components/LevelNav';
import levels from './levels';

const LevelSelect = levels[0];

const heaven = require('assets/sounds/heaven.mp3');

const Level: Screen = (props) => {
  const [selectedIndices, toggleIndex, setSelectedIndices] = useSelectedIndices();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const musicPlayback = useRef<any>(null);

  const dispatch = useDispatch();

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
    if (selectedIndices.size + 1 === 12 && !selectedIndices.has(index)) {
      dispatch(completeLevel(levelNum));
    }
  };

  const handleSetCoinsFound = (indices: Set<number>) => {
    setSelectedIndices(indices);
    if (indices.size === 12) dispatch(completeLevel(levelNum));
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

  const goToMainMenu = useCallback(() => {
    props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'MainMenu'
    }));
  }, []);

  const goToLevelSelect = useCallback(() => goToLevel(0), []);

  let levelNum = props.navigation.getParam('level') || 0;
  if (levelNum >= levels.length) levelNum = 0;

  const handleNextLevel = useCallback(
    () => goToLevel(levelNum + 1)
  , [levelNum]);

  const handleToggleSettings = useCallback(
    () => setSettingsOpen(state => !state)
  , []);

  const levelNavProps = {
    settingsOpen,
    onBack: (levelNum === 0) ? goToMainMenu : goToLevelSelect,
    onToggleSettings: handleToggleSettings,
    onNextLevel: handleNextLevel
  };

  if (levelNum === 0) {
    return (<>
      <LevelNav {...levelNavProps} />
      <LevelSelect
        numLevels={levels.length - 1}
        onGoToLevel={goToLevel}
      />
    </>);
  }

  const LevelX = levels[levelNum] as LevelType;

  return (<>
    <LevelNav {...levelNavProps} />
    <LevelX
      coinsFound={selectedIndices}
      onCoinPress={handleCoinPress}
      setCoinsFound={handleSetCoinsFound}
      onNextLevel={handleNextLevel}
    />
  </>);
};

export default Level;
