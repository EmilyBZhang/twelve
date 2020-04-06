import Matter from 'matter-js';
import { System } from 'react-native-game-engine';

import styles from 'assets/styles';

// TODO: Change numTouches to respond to three different regions of touches
const system: System = (entities, actions) => {
  
  const { physics, balloon0, balloon1, balloon2, state } = entities;
  const { world } = physics;

  const { touches, time, dispatch } = actions;

  if (balloon1) {
    if (state.numTouches > 0) {
      Matter.Body.setVelocity(balloon1.body, {
        x: 0,
        y: 0,
      });
      Matter.Body.translate(balloon1.body, {
        x: 0,
        y: -styles.coinSize / 12 * time.delta / 16,
      });
    }
    if (balloon1.body.position.y < 0) {
      Matter.World.remove(world, balloon1.body);
      delete entities.balloon1;
      for (let i = 0; i < 12; i++) {
        const name = `coin${i}`;
        Matter.World.add(world, entities[name].body);
        entities[name].visible = true;
      }
    }
  }

  touches.forEach(touch => {
    console.log(touch.event.changedTouches);
    switch (touch.type) {
      case 'end': {
        entities.state.numTouches--;
        break;
      }
      case 'start': {
        entities.state.numTouches++;
        world.gravity.y *= -1;
        break;
      }
      case 'move': {
        ;
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
