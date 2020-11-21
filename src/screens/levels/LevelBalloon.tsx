// TODO: IDEA: All the coins are in helium balloons, and you need to press/hold the screen to get them to rise
// Rising will cause the balloons to reach a certain point on the screen, where they'll pop
// TODO: Keep entities even if the app goes out of focus

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { GameEngine, GameEvent } from 'react-native-game-engine';
import Matter from 'matter-js';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import LevelCounter from 'components/LevelCounter';
import Physics from './systems/Physics';
import {
  Balloon,
  Ground,
  CoinContainer,
  Cloud,
  createBalloonBody,
  createWalls,
} from './components/balloon';
import system from './components/LevelBalloon/system';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const { coinSize } = styles;

const initEntities = () => {
  const engine = Matter.Engine.create();
  const world = engine.world;
  const balloon = createBalloonBody(levelWidth / 2, levelHeight / 2);
  const { ground, wallL, wallR } = createWalls();
  Matter.World.add(world, [balloon, ground, wallL, wallR]);
  return ({
    physics: {
      engine,
      world
    },
    balloon: {
      body: balloon,
      renderer: Balloon
    },
    ground: {
      body: ground,
      renderer: Ground
    },
    state: {
      numTouches: 0
    }
  });
};

interface BalloonEvent extends GameEvent {
  type: 'coinPress';
  index: number;
}

const LevelBalloon: Level = (props) => {
  const { onCoinPress, coinsFound } = props;
  const [cloudAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(cloudAnim, {
        toValue: -levelWidth,
        easing: Easing.linear,
        duration: 24000
      })
    ).start();
  }, []);

  const gameEngine = useRef<GameEngine | null>(null);
  const entities = useMemo(() => {
    const getCoin = (index: number) => ({
      visible: false,
      body: Matter.Bodies.circle(
        levelWidth / 2 + (index - 5.5) * coinSize / 5.5,
        0,
        coinSize / 2,
        { frictionAir: 1 / 12, restitution: 0.75 }
      ),
      renderer: CoinContainer,
    });
    const coins = Array.from(Array(12), (_, index) => getCoin(index));
    const coinObj = coins.reduce((coinObj, coin, index) => (
      {...coinObj, [`coin${index}`]: coin}),
      {}
    );
    return {...initEntities(), ...coinObj};
  }, []);

  const handleEvent = (e: BalloonEvent) => {
    if (e.type === 'coinPress') {
      onCoinPress(e.index);
    }
  };

  const numCoinsFound = coinsFound.size;

  return (
    <LevelContainer gradientColors={['#0080ff', 'cyan']}>
      <Cloud style={{transform: [{translateX: cloudAnim}]}} />
      <Cloud style={{
        transform: [{translateX: Animated.add(cloudAnim, levelWidth)}]
      }} />
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
      <LevelCounter count={numCoinsFound} color={'white'} />
    </LevelContainer>
  );
};

export default LevelBalloon;
