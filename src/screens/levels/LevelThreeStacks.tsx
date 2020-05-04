import React, { useState } from 'react';

import { Level } from 'utils/interfaces';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import { DequeTower, Letter } from './components/DequeTower';

const initStacks = [
  ['e', 'e', 'l', 't', 'v', 'w'],
  [],
  [],
];

const LevelThreeStacks: Level = (props) => {

  const [stacks, setStacks] = useState(initStacks);
  const [lastPressed, setLastPressed] = useState(-1);
  const [finalIndex, setFinalIndex] = useState(-1);

  const getCoinIndex = (stackIndex: number, charIndex: number) => (
    charIndex + 6 * ((stackIndex < finalIndex) ? stackIndex : (stackIndex - 1))
  );

  const numCoinsFound = props.coinsFound.size;

  const handleStackPress = (index: number) => {
    if (lastPressed === -1) {
      setLastPressed(index);
      return;
    }
    if (stacks[lastPressed].length > 0 && lastPressed !== index) {
      setStacks(stacks => {
        const oldStack = stacks[lastPressed].slice();
        const elem = oldStack.pop()!;
        const newStack = [...stacks[index], elem];
        if (elem === 'e') {
          if (newStack.join('') === 'twelve') setFinalIndex(index);
        }
        return stacks.map((stack, stackIndex) => {
          switch (stackIndex) {
            case lastPressed: return oldStack;
            case index: return newStack;
            default: return stack;
          }
        });
      });
    }
    setLastPressed(-1);
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {stacks.map((stack, stackIndex) => (
        <DequeTower
          key={String(stackIndex)}
          active={stackIndex === lastPressed}
          onPress={() => handleStackPress(stackIndex)}
          disabled={finalIndex !== -1}
        >
          {(finalIndex === -1 || finalIndex === stackIndex) ? (
            stack.map((c, index) => (
              <Letter key={String(index)}>
                {c}
              </Letter>
            ))
          ) : (
            Array.from(Array(6), (_, index) => {
              const coinIndex = getCoinIndex(stackIndex, index);
              return (
                <Coin
                  onPress={() => props.onCoinPress(coinIndex)}
                  hidden={props.coinsFound.has(coinIndex)}
                  disabled={props.coinsFound.has(coinIndex)}
                />
              );
            })
          )}
        </DequeTower>
      ))}
    </LevelContainer>
  );
};

export default LevelThreeStacks;
