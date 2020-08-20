import Matter from 'matter-js';
import { System } from 'react-native-game-engine';

export const Physics: System = (entities, actions) => {
  const engine = entities.physics.engine as Matter.Engine;
  const { time } = actions;
  let delta = Math.min(time.delta, 1000 / 12);
  while (delta > 0) {
    const d = Math.min(16, delta);// Math.min(1000 / 60, delta);
    Matter.Engine.update(engine, d);
    delta -= d;
  }
  return entities;
};

export const OtherPhysics = (entityName: string) => ((entities, actions) => {
  const engine = entities[entityName].engine as Matter.Engine;
  const { time } = actions;
  let delta = Math.min(time.delta, 1000 / 12);
  while (delta > 0) {
    const d = Math.min(16, delta);// Math.min(1000 / 60, delta);
    Matter.Engine.update(engine, d);
    delta -= d;
  }
  return entities;
}) as System;

export default Physics;
