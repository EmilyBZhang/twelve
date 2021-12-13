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

const threshold = levelWidth / 12;

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
    let lastY = 0;
    let lastDirection = 0;
    panY.addListener(({ value }) => {
      if (value === 0) {
        lastY = 0;
        return;
      }
      if (numShakes.current >= 12) return;
      const direction = Math.sign(value - lastY);
      if (lastDirection === 0) lastDirection = -direction;
      if (direction === lastDirection) {
        lastY = (direction === 1 ? Math.max : Math.min)(lastY, value);
      } else if (Math.abs(value - lastY) >= threshold) {
        numShakes.current++;
        lastY = value;
        lastDirection = direction;
      }
      shakeFactor.setValue(numShakes.current / 6);
      if (numShakes.current >= 12) setCoinsRevealed(true);
    });
    return () => panY.removeAllListeners();
  }, []);

  useEffect(() => {
    if (!coinsRevealed) return;
    baseY.setValue(0);
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
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <PanGestureHandler
        enabled={!coinsRevealed}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <Animated.View style={{ transform: [{
          translateY: coinsRevealed ? (
            Animated.add(baseY, panY)
          ) : (
            Animated.diffClamp(Animated.add(baseY, panY), -threshold, threshold)
          )
        }]}}>
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
