import Matter from 'matter-js';
import { System } from 'react-native-game-engine';

import { CoinInfo } from './entities';

const TouchHandler: System = (entities, update) => {
  const fgWorld = entities.fgPhysics.world as Matter.World;
  const coins = entities.coins.coins as Array<CoinInfo>;
  const { touches, time, dispatch } = update;

  const touch = touches.find(touch => touch.type === 'start');
  if (!touch) return entities;
  else console.log(touch.event);

  const bodies = Matter.Query.point(fgWorld.bodies, {
    x: touch.event.pageX,
    y: touch.event.pageY
  });
  if (bodies.length > 0) {
    coins.forEach(({ body, disabled }, index) => {
      if (disabled) return;
      if (body === bodies[0]) {
        Matter.World.remove(fgWorld, body);
        dispatch({ type: 'coinPress', index });
        coins[index].found = true;
      }
    });
  }
  return entities;
};

export default TouchHandler;
