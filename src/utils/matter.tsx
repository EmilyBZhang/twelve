import Matter from 'matter-js';

interface Bounds {
  max: {
    x: number;
    y: number;
  };
  min: {
    x: number;
    y: number;
  };
}

export const generateWalls = (bounds: Bounds, options?: Matter.IChamferableBodyDefinition) => {
  const wallOptions = {isStatic: true, ...options};
  const { max, min } = bounds;

  const width = max.x - min.x;
  const height = max.y - min.y;
  const mid = {
    x: min.x + width / 2,
    y: min.y + height / 2,
  };

  const wallL = Matter.Bodies.rectangle(
    min.x - width,
    mid.y,
    width * 2,
    height * 5,
    wallOptions,
  );
  const wallR = Matter.Bodies.rectangle(
    max.x + width,
    mid.y,
    width * 2,
    height * 5,
    wallOptions,
  );
  const ceiling = Matter.Bodies.rectangle(
    mid.x,
    min.y - height,
    width * 5,
    height * 2,
    wallOptions,
  );
  const ground = Matter.Bodies.rectangle(
    mid.x,
    max.y + height,
    width * 5,
    height * 2,
    wallOptions,
  );

  return [
    wallL,
    wallR,
    ceiling,
    ground,
  ];
};
