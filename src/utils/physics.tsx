import Matter from 'matter-js';
import { System } from 'react-native-game-engine';

const physics: System = (entities, actions) => {
  const { engine } = entities.physics;
  const { time } = actions;
  Matter.Engine.update(engine, Math.min(time.delta, 1000 / 12));
  return entities;
};

export default physics;
