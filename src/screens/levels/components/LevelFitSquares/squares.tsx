import { RevealedSquareProps } from './FullyConnectedGrid';

const orthScale = 1;
const diagScale = orthScale * Math.SQRT1_2;
const slantScale = orthScale / Math.sqrt(5);

const squares = [
  {x: 0, y: 0, rotation: 0, scale: orthScale},
  {x: 0, y: 0, rotation: 0, scale: orthScale / 2},
  {x: 0.5, y: 0, rotation: 0, scale: orthScale / 2},
  {x: 0, y: 0.5, rotation: 0, scale: orthScale / 2},
  {x: 0.5, y: 0.5, rotation: 0, scale: orthScale / 2},
  {
    x: (1 - diagScale) / 2,
    y: (1 - diagScale) / 2,
    rotation: Math.PI / 4,
    scale: diagScale
  },
  {
    x: (1 - diagScale / 2) / 2,
    y: (0.5 - diagScale / 2) / 2,
    rotation: Math.PI / 4,
    scale: diagScale / 2
  },
  {
    x: (0.5 - diagScale / 2) / 2,
    y: (1 - diagScale / 2) / 2,
    rotation: Math.PI / 4,
    scale: diagScale / 2
  },
  {
    x: (1 - diagScale / 2) / 2,
    y: (1.5 - diagScale / 2) / 2,
    rotation: Math.PI / 4,
    scale: diagScale / 2
  },
  {
    x: (1.5 - diagScale / 2) / 2,
    y: (1 - diagScale / 2) / 2,
    rotation: Math.PI / 4,
    scale: diagScale / 2},
  {
    x: (1 - slantScale) / 2,
    y: (1 - slantScale) / 2,
    rotation: Math.atan(0.5),
    scale: slantScale
  },
  {
    x: (1 - slantScale) / 2,
    y: (1 - slantScale) / 2,
    rotation: Math.atan(2),
    scale: slantScale
  },
] as Array<RevealedSquareProps>;

export default squares;
