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
}
