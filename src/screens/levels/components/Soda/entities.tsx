import React, { FunctionComponent, memo } from 'react';
import { View } from 'react-native';
import Matter from 'matter-js';
import Constants from 'expo-constants';

import styles from 'res/styles';
import { getLevelDimensions } from 'utils/getDimensions';
import Coin from 'components/Coin';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { coinSize } = styles;

export interface BodyComponentProps {
  body: Matter.Body;
  [prop: string]: any;
}

export const shouldUpdateMatterBody = (
  oldProps: BodyComponentProps,
  newProps: BodyComponentProps
) => {
  const { x: x1, y: y1 } = oldProps.body.position;
  const { x: x2, y: y2 } = newProps.body.position;
  return x1 !== x2 || y1 !== y2;
};

export interface CoinContainerProps extends BodyComponentProps {
  visible: boolean;
}

export const CoinContainer: FunctionComponent<CoinContainerProps> = memo((props) => {
  const { body, visible } = props;
  const { x, y } = body.position;

  return (
    <View
      pointerEvents={'none'}
      style={{
        position: 'absolute',
        top: y - coinSize / 2,
        left: x - coinSize / 2,
        zIndex: 4
      }}
    >
      <Coin found={!visible} />
    </View>
  );
}, (a, b) => shouldUpdateMatterBody(a, b) || a.visible !== b.visible);

export const initEntities = () => {
  const engine = Matter.Engine.create();
  const { world } = engine;
  world.gravity.y = 1/4;

  const ground = Matter.Bodies.rectangle(
    levelWidth / 2,
    levelHeight * 2,
    levelWidth * 3,
    levelHeight * 2,
    { isStatic: true }
  );
  const ceiling = Matter.Bodies.rectangle(
    levelWidth / 2,
    -levelHeight,
    levelWidth * 3,
    levelHeight * 2,
    { isStatic: true }
  );
  const wallL = Matter.Bodies.rectangle(
    -levelWidth,
    (levelHeight + styles.levelNavHeight) / 2,
    levelWidth * 2,
    levelHeight + styles.levelNavHeight,
    { isStatic: true }
  );
  const wallR = Matter.Bodies.rectangle(
    levelWidth * 2,
    (levelHeight + styles.levelNavHeight) / 2,
    levelWidth * 2,
    levelHeight + styles.levelNavHeight,
    { isStatic: true }
  );
  // Matter.World.add(world, [ground, ceiling, wallL, wallR]);

  const coinEntities = Array.from(Array(12), () => ({
    visible: false,
    body: Matter.Bodies.circle(
      levelWidth / 2,
      levelHeight / 2 - Constants.statusBarHeight,
      coinSize / 2,
      { frictionAir: 0, restitution: 0.75 }
    ),
    renderer: CoinContainer,
  }));
  
  const coinObj = coinEntities.reduce((accum, entity, index) => ({
    ...accum,
    [index]: entity,
  }), {} as {[index: number]: typeof coinEntities[0]});

  return ({
    physics: { engine, world },
    state: {
      nextCoin: 0,
      remainingTime: 0,
      addedAll: false,
    },
    ...coinObj,
  });
};

export default initEntities;
