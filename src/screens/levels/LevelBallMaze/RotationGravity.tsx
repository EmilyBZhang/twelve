import Matter from 'matter-js';
import { System } from 'react-native-game-engine';

interface Rotation {
  alpha: number;
  beta: number;
  gamma: number;
}

const RotationGravity = (rotation: Rotation) => ((entities, update) => {
  const { physics } = entities;
  const world: Matter.World = physics.world;

  world.gravity.x = Math.sin(rotation.gamma);
  world.gravity.y = Math.sin(rotation.beta);

  return entities;
}) as System;

export default RotationGravity;
