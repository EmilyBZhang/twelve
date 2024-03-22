// MARK: This is practically useless because coin onPress likes to update the sound played when coins are pressed.

import React, { useCallback, useMemo } from 'react';

type CoinCallback = (index: number) => any;

interface CoinCallbackOptions {
  start?: number;
  end?: number;
}

const defaultOptions = {
  start: 0,
  end: 12
};

/**
 * Memoizes an array of callbacks for coin onPress events.
 * 
 * This is to keep referential integrity in comparisons.
 * 
 * @param coinCallback The callback to use when a coin is pressed.
 * @param dependencies An array of dependencies on when to recompute the callback.
 * @param options Options for the array. Define the start and end indices, [start, end), that will be called.
 */
const useCoinCallbacks = (
    coinCallback: CoinCallback,
    dependencies = [] as Array<any>,
    options = defaultOptions as CoinCallbackOptions
  ) => {
    const { start = defaultOptions.start, end = defaultOptions.end } = options;

    const coinCallbacks = useMemo(() => (
      Array.from(
        Array(end - start),
        (_, index) => () => coinCallback(start + index)
      )
    ), dependencies);
    return coinCallbacks;
};

export default useCoinCallbacks;
