/**
 * Does a 1-layer deep comparison of arr1 and arr2 and returns if they are equal.
 * 
 * @param arr1 First array to compare
 * @param arr2 Second array to compare
 */
export const arraysEqual = (arr1: Array<any>, arr2: Array<any>) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => arr2[index] === item);
};

/**
 * Produces a flattened copy (flattened by 1 layer) of an array.
 * 
 * Ex: [[1, 2], [3, 4], [1], [4, 2, 2], []] -> [1, 2, 3, 4, 1, 4, 2, 2]
 * 
 * @param arr Array to flatten
 */
export const flatten = <T extends unknown>(arr: Array<Array<T>>) => (
  arr.reduce((accum, item) => accum.concat(item), [] as Array<T>)
);
