import { FunctionComponent } from 'react';
import Matter from 'matter-js';
import { System } from 'react-native-game-engine';

import styles from 'assets/styles';
import { getLevelDimensions } from 'utils/getDimensions';

const { width: levelWidth } = getLevelDimensions();

const getSection = (x: number) => Math.floor(x / levelWidth * 3);

const translateBody = (body: Matter.Body, y: number) => {
  Matter.Body.setVelocity(body, {
    x: 0,
    y: 0,
  });
  Matter.Body.translate(body, {
    x: 0,
    y
  });
};

const pushUp = (body: Matter.Body, y: number) => translateBody(body, -y);
const pushDown = translateBody;

interface BodyComponent {
  body: Matter.Body;
  renderer: FunctionComponent;
}

// TODO: Consider more succinct mapping
// https://medium.com/@KevinBGreene/typescript-modeling-required-fields-with-mapped-types-f7bf17688786
interface BalloonEntities {
  physics: {
    engine: Matter.Engine;
    world: Matter.World;
  };
  state: {
    numTouches: Array<number>;
  };
  balloon0?: BodyComponent;
  balloon1?: BodyComponent;
  balloon2?: BodyComponent;
  coin0?: BodyComponent;
  coin1?: BodyComponent;
  coin2?: BodyComponent;
  coin3?: BodyComponent;
  coin4?: BodyComponent;
  coin5?: BodyComponent;
  coin6?: BodyComponent;
  coin7?: BodyComponent;
  coin8?: BodyComponent;
  coin9?: BodyComponent;
  coin10?: BodyComponent;
  coin11?: BodyComponent;
}

// TODO: Change numTouches to respond to three different regions of touches
const system: System = (entities, update) => {
  
  const {
    physics,
    balloon0,
    balloon1,
    balloon2,
    state
  } = entities as unknown as BalloonEntities;
  const balloons = [balloon0, balloon1, balloon2];
  const { world } = physics;

  const { touches, time, dispatch } = update;

  state.numTouches.forEach((numTouches, index) => {
    if (balloons[index]) {
      const balloon = balloons[index]!;
      if (numTouches > 0) {
        const translateY = styles.coinSize / 12 * time.delta / 16;
        pushDown(balloon.body, translateY);
        if (balloons[index - 1]) {
          pushUp(balloons[index - 1]!.body, translateY);
        }
        if (balloons[index + 1]) {
          pushUp(balloons[index + 1]!.body, translateY);
        }
      }
      else if (balloon.body.position.y < 0) {
        Matter.World.remove(world, balloon.body);
        delete entities[`balloon${index}`];
        for (let j = 0; j < 4; j++) {
          const i = index * 4 + j;
          const name = `coin${i}`;
          Matter.World.add(world, entities[name].body);
          entities[name].visible = true;
        }
      }
    }
  });

  touches.forEach(touch => {
    const section = getSection(touch.event.pageX);
    if (section < 0 || section > 3) {
      alert (`OY THIS SECTION AIN'T RIGHT, YO ${section}`);
      console.log(`OY THIS SECTION AIN'T RIGHT, YO`, section);
      console.log(touch);
    }
    switch (touch.type) {
      case 'end': {
        entities.state.numTouches[section]--;
        break;
      }
      case 'start': {
        entities.state.numTouches[section]++;
        break;
      }
      case 'move': {
        const oldX = touch.event.pageX - touch.delta!.pageX;
        const oldSection = getSection(oldX);
        entities.state.numTouches[section]++;
        entities.state.numTouches[oldSection]--;
        break;
      }
    }
    console.log(state.numTouches);
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
