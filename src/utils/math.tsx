/**
 * Returns the smallest equivalent non-negative number for m mod n.
 * 
 * @param m Number to modulo
 * @param n Modulus for the operation
 */
export const positiveModulo = (m: number, n: number) => ((m % n) + n) % n;

/**
 * Returns the n-th triangular number.
 * 
 * @param n The n-th triangular number to return.
 */
export const calcTriangularNumber = (n: number) => n * (n + 1) / 2;

/**
 * Calculates what n would result in the n-th triangular number being k.
 * 
 * @param k The triangular number to calculate n for.
 */
export const calcInverseTriangularNumber = (k: number) => (
  (-1 + Math.sqrt(1 + 8 * k)) / 2
);

/**
 * Converts an angle from degrees to radians.
 * 
 * @param deg Angle in degrees.
 */
export const toRad = (deg: number) => deg * Math.PI / 180;

/**
 * Converts an angle from radians to degrees.
 * 
 * @param rad Angle in radians.
 */
export const toDeg = (rad: number) => rad * 180 / Math.PI;

/**
 * Finds the inverse cotangent of x.
 * 
 * @param x cot(theta)
 */
export const acot = (x: number) => Math.PI / 2 - Math.atan(x);
