// TODO: Consider moving the entities function to entities.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { GameEngine, GameEvent } from 'react-native-game-engine';
import Matter from 'matter-js';

import { Level } from 'utils/interfaces';
import styles from 'res/styles';
import Physics, { OtherPhysics } from '../systems/Physics';
import getDimensions, { getLevelDimensions } from 'utils/getDimensions';
import LevelContainer from 'components/LevelContainer';
import LevelCounter from 'components/LevelCounter';
import RotationGravity from './RotationGravity';
import DetectHole from './DetectHole';
import TouchHandler from './TouchHandler';
import { generateWalls } from 'utils/matter';
import {
  MazeRenderer,
  WallsRenderer,
  HoleRenderer,
  CoinsRenderer,
  CoinInfo,
} from './entities';

const { width: windowWidth, height: windowHeight } = getDimensions();
const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const { coinSize } = styles;
const coinRadius = coinSize / 2;
const mazeDim = 8;
const cellSize = coinSize;
const wallWidth = cellSize / (mazeDim - 1);
const mazeSize = levelWidth;

const mazePadding = {
  x: (levelWidth - mazeSize) / 2,
  y: styles.levelNavHeight + (levelHeight - mazeSize) / 2
};

const getCenterCoords = (row: number, col: number) => ({
  x: mazePadding.x + cellSize * (col + 0.5) + wallWidth * col,
  y: mazePadding.y + cellSize * (row + 0.5) + wallWidth * row,
});

/**
 * [row1, row2, col1, col2]
 */
const wallsPos = [
  [0, 0, 0, 8],
  [0, 8, 0, 0],
  [0, 8, 8, 8],
  [1, 1, 1, 2],
  [1, 1, 6, 8],
  [2, 2, 2, 3],
  [2, 2, 4, 5],
  [3, 3, 0, 1],
  [3, 3, 2, 4],
  [3, 3, 5, 6],
  [3, 3, 7, 8],
  [4, 4, 6, 8],
  [5, 5, 3, 5],
  [5, 5, 6, 7],
  [6, 6, 0, 1],
  [6, 6, 2, 3],
  [6, 6, 6, 8],
  [7, 7, 1, 4],
  [0, 2, 1, 1],
  [3, 4, 1, 1],
  [5, 6, 1, 1],
  [4, 7, 2, 2],
  [0, 2, 3, 3],
  [4, 5, 3, 3],
  [1, 3, 4, 4],
  [5, 7, 4, 4],
  [0, 1, 5, 5],
  [3, 4, 5, 5],
  [6, 8, 5, 5],
  [1, 2, 6, 6],
  [3, 5, 6, 6],
  [6, 7, 6, 6],
  [2, 3, 7, 7],
  [7, 8, 7, 7],
  [8, 8, 0, 8],
];

/**
 * [row, col]
 */
const coinCells = [
  [0, 0],
  [0, 1],
  [0, 7],
  [2, 3],
  [2, 7],
  [3, 0],
  [3, 5],
  [3, 7],
  [4, 6],
  [5, 0],
  [6, 2],
  [7, 7],
];

interface LevelEvent extends GameEvent {
  type: 'coinPress';
  index: number;
}

const LevelBallMaze: Level = (props) => {
  const { onCoinPress, coinsFound } = props;

  const [rotation, setRotation] = useState({alpha: 0, beta: 0, gamma: 0});

  useEffect(() => {
    if (twelve) return;
    DeviceMotion.setUpdateInterval(1000 / 60);
    const subscription = DeviceMotion.addListener(res => {
      if (res.rotation) {
        setRotation(res.rotation);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const entities = useMemo(() => {
    const engine = Matter.Engine.create();
    const { world } = engine;
    world.gravity.y = 0;
    
    const fgEngine = Matter.Engine.create();
    fgEngine.world.gravity.y = 0.5;

    const coinBodies = coinCells.map(([r, c]) => {
      const { x, y } = getCenterCoords(r, c);
      return Matter.Bodies.circle(x, y, coinRadius, { frictionAir: 0, restitution: 1/2 });
    });

    const fgWalls = generateWalls({
      max: { x: windowWidth, y: windowHeight },
      min: { x: 0, y: 0 },
    });

    Matter.World.add(world, coinBodies);
    Matter.World.add(fgEngine.world, fgWalls);

    const hole = Matter.Bodies.circle(
      mazePadding.x + mazeSize / 2,
      mazePadding.y + mazeSize / 2,
      coinSize / 24
    );

    const coins = coinBodies.map(coinBody => ({
      body: coinBody,
      disabled: true,
      found: false,
    })) as Array<CoinInfo>;

    const squareSize = coinSize + wallWidth;
    const getWall = (r0: number, r1: number, c0: number, c1: number) => (
      Matter.Bodies.rectangle(
        mazePadding.x + squareSize * (c0 + c1) / 2 - wallWidth / 2,
        mazePadding.y + squareSize * (r0 + r1) / 2 - wallWidth / 2,
        squareSize * (c1 - c0) + wallWidth,
        squareSize * (r1 - r0) + wallWidth,
        { isStatic: true }
      )
    );

    const walls = wallsPos.map(([r1, r2, c1, c2]) => getWall(r1, r2, c1, c2));
    Matter.World.add(world, walls);

    return ({
      physics: {
        engine,
        world,
        renderer: MazeRenderer,
      },
      fgPhysics: {
        engine: fgEngine,
        world: fgEngine.world,
      },
      walls: {
        bodies: walls,
        renderer: WallsRenderer,
      },
      hole: {
        body: hole,
        renderer: HoleRenderer,
      },
      coins: {
        coins,
        renderer: CoinsRenderer,
      },
      /* Debug-only gravity renderer */
      // gravity: {
      //   gravity: world.gravity,
      //   renderer: (props: any) => {
      //     const { gravity } = props;
      //     const { x: gx, y: gy } = gravity;
      //     const x = (gx + 1) / 2 * mazeSize;
      //     const y = (gy + 1) / 2 * mazeSize;
      //     return (
      //       <View style={{
      //         position: 'absolute',
      //         top: y - 10,
      //         left: x - 10,
      //         width: 20,
      //         height: 20,
      //         backgroundColor: 'darkred',
      //         borderRadius: 10
      //       }} />
      //     );
      //   }
      // },
    });
  }, []);

  const handleEvent = (e: LevelEvent) => {
    if (e.type === 'coinPress') {
      onCoinPress(e.index);
    }
  };

  const numCoinsFound = coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter
        count={numCoinsFound}
        zIndex={12}
        position={{top: 0, right: 0}}
      />
      <GameEngine
        style={{
          position: 'absolute',
          top: -styles.levelNavHeight,
          width: windowWidth,
          height: windowHeight,
        }}
        entities={entities}
        systems={[
          Physics,
          OtherPhysics('fgPhysics'),
          RotationGravity(rotation),
          DetectHole,
          TouchHandler,
        ]}
        onEvent={handleEvent}
      />
    </LevelContainer>
  );
};

export default LevelBallMaze;
