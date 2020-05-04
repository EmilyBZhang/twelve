import Matter from 'matter-js';
import { System } from 'react-native-game-engine';

import styles from 'assets/styles';

const system: System = (entities, update) => {
  
  const { physics, balloon, state } = entities;
  const { world } = physics;

  const { touches, time, dispatch } = update;

  if (balloon) {
    if (state.numTouches > 0) {
      Matter.Body.setVelocity(balloon.body, {
        x: 0,
        y: 0,
      });
      Matter.Body.translate(balloon.body, {
        x: 0,
        y: -styles.coinSize / 12 * time.delta / 16,
      });
    }
    if (balloon.body.position.y < 0) {
      Matter.World.remove(world, balloon.body);
      delete entities.balloon;
      for (let i = 0; i < 12; i++) {
        const name = `coin${i}`;
        Matter.World.add(world, entities[name].body);
        entities[name].visible = true;
      }
    }
  }

  touches.forEach(touch => {
    switch (touch.type) {
      case 'end': {
        entities.state.numTouches--;
        break;
      }
      case 'start': {
        entities.state.numTouches++;
        break;
      }
    }
    const bodies = Matter.Query.point(world.bodies, {
      x: touch.event.locationX,
      y: touch.event.locationY
    });
    if (bodies.length > 0) {
      for (let i = 0; i < 12; i++) {
        const name = `coin${i}`;
        if (!entities[name]) continue;
        if (bodies[0] === entities[name].body) {
          Matter.World.remove(world, bodies[0]);
          delete entities[name];
          dispatch({ type: 'coinPress', index: i });
          break;
        }
      }
    }
  });

  return entities;
};

export default system;
