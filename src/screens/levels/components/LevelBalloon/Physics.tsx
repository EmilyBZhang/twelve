// TODO: Add types

import Matter from 'matter-js';

import { getLevelDimensions } from 'utils/getDimensions';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

interface EntitiesType {
  coin: Matter.Body;
  floor: Matter.Body;
}

const Physics = (entities: any, secondArg) => {
  const { touches, time, dispatch } = secondArg;
  // console.log(secondArg);
  let { coin, floor }: EntitiesType = entities;
  let { engine, world } = entities.physics;
  const { body: coinBody } = coin;
  let touched = false;
  touches.forEach(t => {
    if (t.type === 'start') {
      dispatch({ type: 'touch-started' });
      Matter.Body.setVelocity(coinBody, {
        x: 0,
        y: -2
      });
    }
    // } else if (t.type === 'end') {
    //   dispatch({ type: 'touch-ended' });
    //   Matter.Body.setVelocity(coinBody, {
    //     x: 0,
    //     y: 1
    //   });
    // }
    // console.log(t);
    // touched = true;
  })
  Matter.Engine.update(engine, time.delta);
  return entities;
};

export default Physics;
