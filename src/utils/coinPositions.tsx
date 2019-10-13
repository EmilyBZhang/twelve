import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'assets/styles';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const deltaX = levelWidth / 4;
const deltaY = levelHeight / 5;
const initX = deltaX - styles.coinSize / 2;
const initY = deltaY - styles.coinSize / 2;

export const positions4x3 = Array(12).fill(null).map((_, index: number) => ({
  left: initX + deltaX * (index % 3),
  top: initY + deltaY * Math.floor(index / 3)
}));

export default positions4x3;
