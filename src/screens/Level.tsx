// TODO: See if other things could useCallback/useMemo to optimize renders of memo components

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';

import useSettings from 'hooks/useSettings';
import { Screen, Level as LevelType } from 'utils/interfaces';
import useSelectedIndices from 'hooks/useSelectedIndices';
import playAudio, { CreateAudioResult } from 'utils/playAudio';
import { playCoinSound } from 'utils/playPitch';
import colors from 'res/colors';

import LevelNav from 'components/LevelNav';
import levels from './levels';
import WinModal from 'components/WinModal';
import { Audio } from 'expo-av';

const LevelSelect = levels[0];

const victorySound = require('assets/sfx/victory.mp3');
const buzzSound = require('assets/sfx/buzz.mp3');

const Level: Screen = (props) => {
  const [selectedIndices, toggleIndex, setSelectedIndices] =
    useSelectedIndices();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const musicPlayback = useRef<CreateAudioResult | null>(null);

  let levelNum = props.navigation.getParam('level') || 0;
  if (levelNum > levels.length) levelNum = 0;

  const [{ levelStatus }, { completeLevel }] = useSettings();

  const coinsFound = selectedIndices.size;
  const twelve = coinsFound >= 12;

  useEffect(() => {
    if (twelve) {
      playAudio(
        victorySound,
        (playback) => (musicPlayback.current = playback),
        { volume: 0.5 }
      );
      return () => {
        if (musicPlayback.current?.sound) {
          musicPlayback.current.sound
            .stopAsync()
            .catch((err: any) => console.warn(err));
        }
      };
    }
  }, [twelve]);

  const handleCoinPress = (index?: number) => {
    if (index === undefined) index = coinsFound;
    playCoinSound(coinsFound);
    toggleIndex(index);
    if (selectedIndices.size + 1 === 12 && !selectedIndices.has(index)) {
      completeLevel(levelNum);
    }
  };

  const handleSetCoinsFound = (indices?: Set<number>) => {
    if (!indices) indices = new Set();
    if (!indices.size && selectedIndices.size) playAudio(buzzSound);
    setSelectedIndices(indices);
    if (indices.size === 12) completeLevel(levelNum);
  };

  const goToLevel = useCallback((index: number) => {
    setSelectedIndices(new Set<number>());
    props.navigation.dispatch(
      NavigationActions.navigate({
        routeName: 'Level',
        params: { level: index },
      })
    );
  }, []);

  // TODO: Fix this function if possible, feels unclean
  const restartLevel = () => {
    props.navigation.goBack();
    goToLevel(levelNum);
  };

  const goToMainMenu = useCallback(() => {
    props.navigation.dispatch(
      NavigationActions.navigate({
        routeName: 'MainMenu',
      })
    );
  }, []);

  const goToLevelSelect = useCallback(() => goToLevel(0), []);

  const goToCredits = useCallback(() => {
    props.navigation.dispatch(
      NavigationActions.navigate({
        routeName: 'Credits',
        params: { finishGame: true },
      })
    );
  }, []);

  // TODO: Check if prev/next levels are unlocked
  const handlePrevLevel = useCallback(
    () => goToLevel(levelNum - 1),
    [levelNum]
  );

  // TODO: Check if prev/next levels are unlocked
  const handleNextLevel = useCallback(
    () => goToLevel(levelNum + 1),
    [levelNum]
  );

  const handleRestart = useCallback(restartLevel, [levelNum]);

  const handleToggleSettings = useCallback(
    () => setSettingsOpen((state) => !state),
    []
  );

  const handleGoToLevelSelect = useCallback(() => {
    goToLevel(0);
    handleToggleSettings();
  }, []);

  const handleHint = useCallback(() => {
    setHintOpen((state) => !state);
  }, [levelNum]);

  useEffect(() => {
    if (levelNum === levels.length) goToCredits();
  }, [levelNum]);

  if (levelNum === levels.length) {
    return null;
  }

  const levelNavProps = {
    settingsOpen,
    hintOpen,
    // TODO: Look into NavigationActions.back or props.navigation.goBack
    onBack: levelNum ? goToLevelSelect : goToMainMenu,
    onToggleSettings: levelNum ? handleToggleSettings : undefined,
    onPrevLevel: levelStatus[levelNum - 2]?.unlocked
      ? handlePrevLevel
      : undefined,
    onNextLevel: handleNextLevel,
    // onNextLevel: levelStatus[levelNum]?.unlocked ? handleNextLevel : undefined,
    // onPrevLevel: levelStatus[levelNum - 2]?.unlocked ? handlePrevLevel : undefined,
    // onNextLevel: levelStatus[levelNum]?.unlocked ? handleNextLevel : undefined,
    onGoToLevelSelect: levelNum ? handleGoToLevelSelect : undefined,
    onRestart: levelNum ? handleRestart : undefined,
    level: levelNum,
    // TODO: Consider removing this from LevelNav
    settingsTitle: levelNum ? `Level ${levelNum}` : 'Select Level',
    onHint: levelNum ? handleHint : undefined,
  };

  if (levelNum === 0)
    return (
      <>
        <LevelNav {...levelNavProps} />
        <LevelSelect numLevels={levels.length - 1} onGoToLevel={goToLevel} />
      </>
    );

  const LevelX = levels[levelNum] as LevelType;

  return (
    <>
      <LevelNav {...levelNavProps} />
      <WinModal
        level={levelNum}
        onNextLevel={handleNextLevel}
        visible={twelve}
      />
      <LevelX
        levelNum={levelNum}
        coinsFound={selectedIndices}
        onCoinPress={handleCoinPress}
        setCoinsFound={handleSetCoinsFound}
        onNextLevel={handleNextLevel}
        setSettingsOpen={setSettingsOpen}
        setHintOpen={setHintOpen}
        navigation={props.navigation}
      />
    </>
  );
};

export default Level;
