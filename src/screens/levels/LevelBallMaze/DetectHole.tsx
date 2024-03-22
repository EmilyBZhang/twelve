import Matter from 'matter-js';
import { System } from 'react-native-game-engine';

import { CoinInfo } from './entities';

const DetectHole: System = (entities, update) => {
  const { physics, fgPhysics } = entities;

  const world: Matter.World = physics.world;
  const fgWorld: Matter.World = fgPhysics.world;
  const bounds = entities.hole.body.bounds as Matter.Bounds;

  const coins = entities.coins.coins as Array<CoinInfo>;
  const coinBodies = coins.filter(coin => coin.disabled).map(coin => coin.body);

  const bodies = Matter.Query.region(coinBodies, bounds);
  let i = 0;
  bodies.forEach(body => {
    Matter.World.remove(world, body);
    while (coins[i].body !== body && i < coins.length) i++;
    if (i === coins.length) {
      console.warn('Warning: Index out of bounds when searching bodies (DetectHole.tsx).');
      return;
    }
    coins[i].disabled = false;
    Matter.World.add(fgWorld, body);
  });

  return entities;
};

export default DetectHole;
