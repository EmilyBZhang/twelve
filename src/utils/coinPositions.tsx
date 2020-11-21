import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

interface PositionOptions {
  containerWidth?: number;
  containerHeight?: number;
  coinSize?: number;
  xOffset?: number;
  yOffset?: number;
}

const defaultOptions = {
  containerWidth: levelWidth,
  containerHeight: levelHeight,
  coinSize: styles.coinSize,
  xOffset: 0,
  yOffset: 0,
};

/**
 * Calculate absolute positions (relative to top and left) of coins, spread evenly throughout a container.
 * 
 * @param numRows Number of rows of coins to display
 * @param numCols Number of columsn of coins to display
 * @param options Object specifying containerWidth, containerHeight, and coinSize
 */
export const calcPositions = (numRows = 4, numCols = 3, options: PositionOptions = defaultOptions) => {
  const {
    containerWidth,
    containerHeight,
    coinSize,
    xOffset,
    yOffset,
  } = {...defaultOptions, ...options};

  const deltaX = containerWidth / (numCols + 1);
  const deltaY = containerHeight / (numRows + 1);
  const initX = deltaX - coinSize / 2 + xOffset;
  const initY = deltaY - coinSize / 2 + yOffset;
  return Array.from(Array(numRows * numCols), (_, index: number) => ({
    left: initX + deltaX * (index % numCols),
    top: initY + deltaY * Math.floor(index / numCols)
  }));
};

export const positions4x3 = calcPositions();

export default positions4x3;
