// TODO: See if other things could useCallback/useMemo to optimize renders of memo components

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationActions } from 'react-navigation';

import useSettings from 'hooks/useSettings';
import { Screen, Level as LevelType } from 'utils/interfaces';
import useSelectedIndices from 'hooks/useSelectedIndices';
import playAudio from 'utils/playAudio';
import { playCoinSound } from 'utils/playPitch';
import colors from 'assets/colors';

import LevelNav from 'components/LevelNav';
import levels from './levels';
import WinModal from 'components/WinModal';

const LevelSelect = levels[0];

const heaven = require('assets/sounds/heaven.mp3');

const Level: Screen = (props) => {
  
  const [selectedIndices, toggleIndex, setSelectedIndices] = useSelectedIndices();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const musicPlayback = useRef<any>(null);
  
  let levelNum = props.navigation.getParam('level') || 0;
  if (levelNum > levels.length) levelNum = 0;
  
  const { completeLevel } = useSettings()[1];

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
      completeLevel(levelNum);
    }
  };

  const handleSetCoinsFound = (indices: Set<number>) => {
    setSelectedIndices(indices);
    if (indices.size === 12) completeLevel(levelNum);
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

  // TODO: Fix this function if possible, feels unclean
  const restartLevel = () => {
    props.navigation.goBack();
    goToLevel(levelNum);
  };

  const goToMainMenu = useCallback(() => {
    props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'MainMenu'
    }));
  }, []);

  const goToLevelSelect = useCallback(() => goToLevel(0), []);

  const goToCredits = useCallback(() => {
    props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'Credits'
    }));
  }, []);

  const handleNextLevel = useCallback(
    () => goToLevel(levelNum + 1),
    [levelNum]
  );

  const handleRestartLevel = useCallback(
    () => restartLevel(),
    [levelNum]
  );

  const handleToggleSettings = useCallback(
    () => setSettingsOpen(state => !state),
    []
  );

  if (levelNum === levels.length) {
    goToCredits();
    return null;
  }

  const levelNavProps = {
    settingsOpen,
    // TODO: Look into NavigationActions.back or props.navigation.goBack
    onBack: (levelNum === 0) ? goToMainMenu : goToLevelSelect,
    onToggleSettings: handleToggleSettings,
    onNextLevel: handleNextLevel,
    onRestartLevel: handleRestartLevel,
    ...levelNum && {settingsTitle: `Level ${levelNum}`}
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
    <WinModal
      onNextLevel={handleNextLevel}
      visible={twelve}
    />
    <LevelX
      coinsFound={selectedIndices}
      onCoinPress={handleCoinPress}
      setCoinsFound={handleSetCoinsFound}
      onNextLevel={handleNextLevel}
    />
  </>);
};

export default Level;
