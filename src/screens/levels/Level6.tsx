import React, { useState, useEffect, useRef } from 'react';
import { Animated, Button, View } from 'react-native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import getCongratsMessage from 'utils/getCongratsMessage';
import colors from 'assets/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const getNextIndex = (selectedIndices = new Set<number>()) => {
  let tempIndex = Math.floor(Math.random() * (12 - selectedIndices.size));
  for (let i = 0; i <= tempIndex; i++) {
    if (selectedIndices.has(i)) tempIndex++;
  }
  return tempIndex;
};

const Level6: Level = (props) => {
  const [congratsMessage] = useState<string>(() => getCongratsMessage());
  const [visible, setVisible] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const [nextIndex, setNextIndex] = useState(getNextIndex);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const blinkCoins = useRef<any>(null);
  useEffect(() => {
    if (twelve) {
      clearInterval(blinkCoins.current);
      blinkCoins.current = null;
    } else if (!blinkCoins.current) {
      blinkCoins.current = setInterval(() => {
        setVisible(state => !state);
        setShowNext(true);
      }, 1000);
    }
  }, [twelve]);

  const handleCoinPress = (index: number) => {
    setShowNext(false);
    if (index === nextIndex) {
      let newIndices = new Set<number>(props.coinsFound);
      newIndices.add(index);
      setNextIndex(() => getNextIndex(newIndices));
      props.onCoinPress(index);
    } else {
      setNextIndex(() => getNextIndex());
      props.setCoinsFound(new Set<number>());
    }
  };

  return (
    <LevelContainer>
      {((visible && showNext) || twelve) && (
        <LevelCounter count={numCoinsFound} />
      )}
      <LevelText>
        {twelve ? congratsMessage : '...?'}
      </LevelText>
      {twelve && (
        <Button
          title='Next level!'
          onPress={() => props.onNextLevel()}
        />
      )}
      {Array(12).fill(null).map((_, index: number) => (
        <Animated.View
          key={String(index)}
          style={{
            position: 'absolute',
            ...coinPositions[index]
          }}
        >
          <Coin
            color={colors.selectCoin}
            found={twelve}
            hidden={!showNext || !visible || (index !== nextIndex && !props.coinsFound.has(index))}
            onPress={() => handleCoinPress(index)}
          />
        </Animated.View>
      ))}
    </LevelContainer>
  );
};

export default Level6;
