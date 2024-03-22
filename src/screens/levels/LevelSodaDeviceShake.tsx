import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Animated, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import LevelContainer from 'components/LevelContainer';
import LevelCounter from 'components/LevelCounter';
import colors from 'res/colors';
import DeviceShake from 'utils/DeviceShake';
import Soda from './components/Soda';
import initEntities from './components/Soda/entities';
import system, { CoinEvent } from './components/Soda/system';
import Physics from './systems/Physics';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const Screen = styled(Animated.View)`
  top: 0px;
  left: 0px;
  position: absolute;
  width: ${levelWidth}px;
  height: ${levelHeight}px;
  background-color: ${colors.badCoin}80;
`;

const LevelSodaShake: Level = (props) => {

  const [anim] = useState(new Animated.Value(0));
  const [shakeFactor] = useState(new Animated.Value(0));
  const [coinsRevealed, setCoinsRevealed] = useState(false);
  const [engineStarted, setEngineStarted] = useState(false);

  const gameEngine = useRef<GameEngine | null>(null);
  const entities = useMemo(initEntities, []);
  
  useEffect(() => {
    let numShakes = 0;
    const listener = DeviceShake.addListener(() => {
      if (numShakes === 12) {
        setCoinsRevealed(true);
        return;
      }
      numShakes++;
      shakeFactor.setValue(numShakes / 6);
    });
    return () => DeviceShake.removeSubscription(listener);
  }, []);

  useEffect(() => {
    if (!coinsRevealed) return;
    Animated.timing(anim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setEngineStarted(true);
    });
  }, [coinsRevealed]);
  
  const handleEvent = (e: CoinEvent) => {
    if (e.type === 'coinPress') props.onCoinPress(e.index);
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <Animated.View style={{ transform: [{ translateY: Animated.multiply(anim, levelHeight / 4) }]}}>
        <Soda
          opened={engineStarted}
          shakeFactor={shakeFactor}
        />
      </Animated.View>
      {engineStarted ? (
        <GameEngine
          ref={ref => gameEngine.current = ref}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: levelWidth,
            height: levelHeight,
          }}
          entities={entities}
          systems={[Physics, system]}
          onEvent={handleEvent}
        />
      ) : (
        <Screen style={{ opacity: Animated.subtract(1, anim) }} />
      )}
    </LevelContainer>
  );
};

export default LevelSodaShake;
