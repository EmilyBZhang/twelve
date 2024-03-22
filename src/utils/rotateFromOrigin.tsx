type TransformOrigin = 'bottom';
type Dimensions = {width: number, height: number};

const getTranslationRatios = (transformOrigin: TransformOrigin, deg: number, dim: Dimensions) => {
  const { width, height } = dim;
  const rad = deg * Math.PI / 180;
  switch (transformOrigin) {
    case 'bottom':
      return {x: height / 2 * Math.sin(rad), y: height / 2 * (1 - Math.cos(rad))};
    default:
      return {x: 0, y: 0};
  }
};

export const rotateFromOrigin = (transformOrigin: TransformOrigin, deg: number, dim: Dimensions) => {
  const { x, y } = getTranslationRatios(transformOrigin, deg, dim);
  return [
    {translateX: x},
    {translateY: y},
    {rotate: `${deg}deg`},
  ];
};

export const generateRotationString = (transformOrigin: TransformOrigin, deg: number, dim: Dimensions) => {
  const [
    { translateX },
    { translateY },
    { rotate },
  ] = rotateFromOrigin(transformOrigin, deg, dim);
  return `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate})`;
};

export default rotateFromOrigin;
