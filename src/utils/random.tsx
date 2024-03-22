import styles from 'res/styles';
import { getLevelDimensions } from 'utils/getDimensions';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

/**
 * Selects a random float (uniformly) from the range [first, second).
 * 
 * If second is undefined, the function returns a random float from the range [0, first).
 * 
 * @param first Minimum float in range (included) OR maximum float in range [0, first).
 * @param second Maximum float in range (excluded).
 */
export const randFloat = (first: number, second?: number) => {
  const min = (second !== undefined) ? first : 0;
  const max = (second !== undefined) ? second : first;
  return Math.random() * (max - min) + min;
};

/**
* Selects a random integer (uniformly) from the range [first, second).
* 
* If second is undefined, the function returns a random integer from the range [0, first).
* 
* @param first Minimum integer in range (included) OR maximum integer in range [0, first).
* @param second Maximum integer in range (excluded).
*/
export const randInt = (first: number, second?: number) => {
  return Math.floor(randFloat(first, second));
};

/**
 * Chooses and returns a random element from an array.
 * 
 * If start and end are defined, a random element is chosen from indices [start, end).
 * 
 * @param arr Array to choose a random element from.
 * @param start (Optional) Index to start random selection from (included).
 * @param end (Optional) Index to end random selection from (excluded).
 */
export const randElem = <T extends unknown>(
    arr: Array<T>,
    start = 0,
    end = arr.length
  ) => {
    return arr[randInt(start, end)];
};

/**
 * Simulates a Bernoulli trial and returns true or false.
 * 
 * Chance of true is p and chance of false is (1 - p).
 * 
 * @param p The probability of a success (returning true).
 */
export const bernoulli = (p: number = 0.5) => {
  return Math.random() < p;
};

/**
 * Generates a random variable with a Gaussian distribution.
 * 
 * @param mean The mean of the Gaussian distribution (default: 0)
 * @param sd The standard deviation of the Gaussian distribution (default: 1)
 */
export const gaussian = (mean = 0, sd = 1) => {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * sd + mean;
};

/**
 * Randomly shuffles an array in place.
 * 
 * @param arr Array to shuffle.
 */
export const shuffleArray = <T extends unknown>(arr: Array<T>) => {
  for (let i = arr.length; i > 0; --i) {
    const index = randInt(i);
    const temp = arr[index];
    arr[index] = arr[i - 1];
    arr[i - 1] = temp;
  }
};

/**
 * Selects a random 2D point, with x in range [x0, x1) and y in range [y0, y1).
 * 
 * @param x0 Leftmost point
 * @param y0 Topmost point
 * @param x1 Rightmost point
 * @param y1 Bottommost point
 */
export const randPoint = (x0: number, y0: number, x1: number, y1: number) => ({
  x: randFloat(x0, x1),
  y: randFloat(y0, y1),
});

const defaultRandCoinOptions = {
  coinSize: styles.coinSize,
  x0: 0,
  y0: 0,
  x1: levelWidth,
  y1: levelHeight,
};

/**
 * Selects a random 2D point for a coin.
 * 
 * Generates based on a coin size and the vertices of the box (x0, y0), (x1, y1).
 * 
 * @param options Object with props: coinSize, x0, y0, x1, y1
 */
export const randCoinPoint = (options = defaultRandCoinOptions) => (
  randPoint(
    options.x0,
    options.y0,
    options.x1 - options.coinSize,
    options.y1 - options.coinSize
  )
);

/**
 * Selects a random 2D position for a coin.
 * 
 * Generates based on a coin size and the vertices of the box (x0, y0), (x1, y1).
 * 
 * @param options Object with props: coinSize, x0, y0, x1, y1
 */
export const randCoinPosition = (options = defaultRandCoinOptions) => {
  const { x, y } = randCoinPoint(options);
  return { left: x, top: y };
};
