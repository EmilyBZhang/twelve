import React, { useState } from 'react';

import { Level } from 'utils/interfaces';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import { DequeTower, Letter } from './components/DequeTower';

const initStack = ['e', 'e', 'l', 't', 'v', 'w'];
const initQueue = [] as Array<string>;

const isTwelve = (chars: Array<string>) => chars.join('') === 'twelve';

const LevelStackQueue: Level = (props) => {

  const [stack, setStack] = useState(initStack);
  const [queue, setQueue] = useState(initQueue);

  const numCoinsFound = props.coinsFound.size;

  const handleStackPress = () => {
    if (stack.length === 0) return;
    setStack(stack => {
      if (!stack.length) return stack;
      const newStack = stack.slice();
      const elem = newStack.pop()!;
      setQueue(queue => [...queue, elem]);
      return newStack;
    });
  };

  const handleQueuePress = () => {
    if (queue.length === 0) return;
    setQueue(queue => {
      if (!queue.length) return queue;
      const [elem, ...newQueue] = queue;
      setStack(stack => [...stack, elem]);
      return newQueue;
    });
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <DequeTower
        onPress={handleStackPress}
      >
        {(stack.length || !isTwelve(queue)) ? (
          stack.map((c, index) => (
            <Letter key={String(index)}>
              {c}
            </Letter>
          ))
        ) : (
          Array.from(Array(6), (_, index) => (
            <Coin
              key={String(index)}
              onPress={() => props.onCoinPress(index)}
              hidden={props.coinsFound.has(index)}
              disabled={props.coinsFound.has(index)}
            />
          ))
        )}
      </DequeTower>
      <DequeTower
        isQueue
        onPress={handleQueuePress}
      >
        {(queue.length || !isTwelve(stack)) ? (
          queue.map((c, index) => (
            <Letter key={String(index)}>
              {c}
            </Letter>
          ))
        ) : (
          Array.from(Array(6), (_, index) => (
            <Coin
              key={String(index)}
              onPress={() => props.onCoinPress(6 + index)}
              hidden={props.coinsFound.has(6 + index)}
              disabled={props.coinsFound.has(6 + index)}
            />
          ))
        )}
      </DequeTower>
    </LevelContainer>
  );
};

export default LevelStackQueue;
