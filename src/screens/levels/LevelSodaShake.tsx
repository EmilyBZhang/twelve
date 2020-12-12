import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Animated, Easing, View } from 'react-native';
import {
  State,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { GameEngine, GameEvent } from 'react-native-game-engine';

import { Level } from 'utils/interfaces';
import LevelContainer from 'components/LevelContainer';
import LevelCounter from 'components/LevelCounter';
import { getLevelDimensions } from 'utils/getDimensions';
import Soda from './components/Soda';
import initEntities from './components/Soda/entities';
import system, { CoinEvent } from './components/Soda/system';
import Physics from './systems/Physics';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const threshold = levelWidth / 6;

enum Y {
  UP,
  DOWN,
  NEUTRAL,
}

const LevelSodaShake: Level = (props) => {

  const [baseY] = useState(new Animated.Value(0));
  const [panY] = useState(new Animated.Value(0));
  const [shakeFactor] = useState(new Animated.Value(0));
  const [coinsRevealed, setCoinsRevealed] = useState(false);
  const [engineStarted, setEngineStarted] = useState(false);
  const numShakes = useRef(0);

  const gameEngine = useRef<GameEngine | null>(null);
  const entities = useMemo(initEntities, []);

  useEffect(() => {
    let direction = Y.NEUTRAL;
    let baseYVal = 0;
    baseY.addListener(({ value }) => { baseYVal = value; });
    panY.addListener(({ value }) => {
      if (numShakes.current >= 12 || value === 0) return;
      const y = baseYVal + value;
      if (y <= -threshold) {
        if (numShakes.current === 0) direction = Y.UP;
        if ((numShakes.current % 2 === 0) === (direction === Y.UP)) numShakes.current++;
      } else if (y >= threshold) {
        if (numShakes.current === 0) direction = Y.DOWN;
        if ((numShakes.current % 2 === 0) === (direction === Y.DOWN)) numShakes.current++;
      } else return;
      shakeFactor.setValue(numShakes.current / 6);
      if (numShakes.current >= 12) setCoinsRevealed(true);
    });
    return () => {
      baseY.removeAllListeners();
      panY.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (!coinsRevealed) return;
    Animated.timing(baseY, {
      toValue: levelHeight / 4,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setEngineStarted(true);
    });
  }, [coinsRevealed]);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY }}], { useNativeDriver: true }
  );

  const handleStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === State.END || e.nativeEvent.state === State.CANCELLED) {
      const { translationY } = e.nativeEvent;
      panY.setValue(0);
      baseY.setOffset(translationY);
      baseY.flattenOffset();
    }
  };
  
  const handleEvent = (e: CoinEvent) => {
    if (e.type === 'coinPress') props.onCoinPress(e.index);
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <PanGestureHandler
        enabled={!coinsRevealed}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <Animated.View style={{ transform: [{ translateY: Animated.add(baseY, panY) }]}}>
          <Soda
            opened={engineStarted}
            shakeFactor={shakeFactor}
          />
        </Animated.View>
      </PanGestureHandler>
      {engineStarted && (
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
      )}
    </LevelContainer>
  );
};

export default LevelSodaShake;
