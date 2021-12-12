import Matter from 'matter-js';
import { System, GameEvent } from 'react-native-game-engine';
import Constants from 'expo-constants';

import styles from 'res/styles';
import { getLevelDimensions } from 'utils/getDimensions';
import { acot } from 'utils/math';
import { gaussian, randFloat } from 'utils/random';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

export interface CoinEvent extends GameEvent {
  type: 'coinPress';
  index: number;
}

const randAngle = () => Math.PI * randFloat(5/12, 7/12);
const resetBody = (body: Matter.Body) => {
  const angle = randAngle();
  const r = levelHeight / 216;
  Matter.Body.setPosition(body, {
    x: levelWidth / 2,
    y: levelHeight / 2 + Constants.statusBarHeight,
  });
  Matter.Body.setVelocity(body, {
    x: r * Math.cos(angle),
    y: r * -Math.sin(angle),
  });
};

export const system: System = (entities, update) => {
  
  const { physics, state } = entities;
  const { world } = physics;

  const { touches, time, dispatch } = update;
  const { delta } = time;

  if (state.remainingTime <= 0) {
    const coinEntity = entities[state.nextCoin];
    if (coinEntity) {
      const body = coinEntity.body as Matter.Body;
      body.collisionFilter.group = -1;
      resetBody(body);
  
      if (!state.addedAll) Matter.World.add(world, coinEntity.body);
      coinEntity.visible = true;
    }

    state.remainingTime += 250;
    state.nextCoin++;
    if (state.nextCoin === 12) {
      state.addedAll = true;
      state.nextCoin = 0;
    }
  } else {
    state.remainingTime -= delta;
  }

  touches.forEach(touch => {
    if (touch.type !== 'start') return;
    const bodies = Matter.Query.point(world.bodies, {
      x: touch.event.locationX,
      y: touch.event.locationY
    });
    if (bodies.length > 0) {
      for (let i = 0; i < 12; i++) {
        if (!entities[i]) continue;
        if (bodies[0] === entities[i].body) {
          Matter.World.remove(world, bodies[0]);
          delete entities[i];
          dispatch({ type: 'coinPress', index: i });
          break;
        }
      }
    }
  });

  return entities;
};

export default system;
