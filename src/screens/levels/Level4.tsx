import React, { useState, useEffect, useRef } from 'react';
import { Animated, Button, Dimensions, View } from 'react-native';

import { Level } from '../../utils/interfaces';
import playBell from '../../utils/playBell';
import getCongratsMessage from '../../utils/getCongratsMessage';
import ScreenContainer from '../../components/ScreenContainer';
import Coin from '../../components/Coin';
import LevelText from '../../components/LevelText';
import LevelCounter from '../../components/LevelCounter';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const coinSize = 40;

const Level4: Level = (props) => {
  const [congratsMessage] = useState<string>(() => getCongratsMessage());
  const [visible, setVisible] = useState(false);
  const [showNext, setShowNext] = useState(true);

  const getNextIndex = (selectedIndices = new Set<number>()) => {
    let tempIndex = Math.floor(Math.random() * (12 - selectedIndices.size));
    for (let i = 0; i <= tempIndex; i++) {
      if (selectedIndices.has(i)) tempIndex++;
    }
    return tempIndex;
  };
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
      playBell(numCoinsFound + 1);
      setNextIndex(() => getNextIndex());
      props.setCoinsFound(new Set<number>());
    }
  };

  const deltaX = windowWidth / 4;
  const deltaY = windowHeight / 5;
  const initX = deltaX - coinSize / 2;
  const initY = deltaY - coinSize / 2;

  const positions = Array(12).fill(null).map((_, index: number) => ({
    left: initX + deltaX * (index % 3),
    top: initY + deltaY * Math.floor(index / 3)
  }));

  return (
    <ScreenContainer>
      {((visible && showNext) || twelve) && (
        <LevelCounter count={numCoinsFound} />
      )}
      <LevelText>
        {twelve ? congratsMessage : '...?'}
      </LevelText>
      {(twelve && props.onGoToLevel) && (
        <Button
          title='Next level!'
          onPress={() => props.onGoToLevel!(0)}
        />
      )}
      {Array(12).fill(null).map((_, index: number) => (
        <Animated.View
          key={String(index)}
          style={{
            position: 'absolute',
            ...positions[index]
          }}
        >
          <Coin
            size={coinSize}
            hidden={!showNext || !visible || (index !== nextIndex && !props.coinsFound.has(index))}
            found={twelve}
            onPress={() => handleCoinPress(index)}
          />
        </Animated.View>
      ))}
    </ScreenContainer>
  );
};

export default Level4;
