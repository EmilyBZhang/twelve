import React, { useState, useEffect, useRef } from 'react';
import { Animated, Button, View, Easing } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import { getLevelDimensions } from 'utils/getDimensions';
import { randInt } from 'utils/random';
import styles from 'res/styles';
import colors, { CoinColor } from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ColorHint from 'components/ColorHint';
import ScavengerText from 'components/ScavengerText';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const coinSize = styles.coinSize;

const GhostCoin = styled(Animated.View)`
  position: absolute;
  width: ${coinSize}px;
  height: ${coinSize}px;
  border-radius: ${coinSize / 2}px;
  justify-content: center;
  align-items: center;
`;

const getNextIndex = (selectedIndices = new Set<number>()) => {
  let tempIndex = randInt(12 - selectedIndices.size);
  for (let i = 0; i <= tempIndex; i++) {
    if (selectedIndices.has(i)) tempIndex++;
  }
  return tempIndex;
};

const LevelNewcomerCoin: Level = (props) => {
  const [visible, setVisible] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const [nextIndex, setNextIndex] = useState(getNextIndex);
  const [ghostPos, setGhostPos] = useState({left: levelWidth, top: levelHeight});
  const [ghostColor, setGhostColor] = useState<CoinColor | undefined>(undefined);
  const [ghostAnim] = useState(new Animated.Value(0));

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const blinkCoins = useRef<any>(null);
  useEffect(() => {
    if (twelve) {
      if (blinkCoins.current) clearInterval(blinkCoins.current);
      blinkCoins.current = null;
    } else if (!blinkCoins.current) {
      blinkCoins.current = setInterval(() => {
        setVisible(state => !state);
        setShowNext(true);
      }, 1000);
    }
    return () => {
      if (blinkCoins.current) clearInterval(blinkCoins.current);
    };
  }, [twelve]);

  const handleCoinPress = (index: number) => {
    setShowNext(false);
    setGhostPos(coinPositions[index]);
    if (index === nextIndex) {
      props.onCoinPress(index);
      let newIndices = new Set<number>(props.coinsFound);
      newIndices.add(index);
      setNextIndex(() => getNextIndex(newIndices));
      setGhostColor(colors.coin);
    } else {
      setNextIndex(() => getNextIndex());
      props.setCoinsFound(new Set<number>());
      setGhostColor(colors.badCoin);
    }
    ghostAnim.setValue(0);
    Animated.timing(ghostAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start(() => setGhostColor(undefined));
  };

  const ghostTranslateY = ghostAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -coinSize]
  });
  const ghostOpacity = Animated.subtract(1, ghostAnim);

  return (
    <LevelContainer>
      {((visible && showNext) || twelve) && (
        <LevelCounter count={numCoinsFound} />
      )}
      <LevelText hidden={twelve}>
        Do<ScavengerText>n</ScavengerText>'t blink!
      </LevelText>
      {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{
            position: 'absolute',
            ...coinPosition
          }}
        >
          <Coin
            noShimmer
            color={colors.selectCoin}
            found={twelve}
            hidden={!showNext || !visible || (index !== nextIndex && !props.coinsFound.has(index))}
            onPress={() => handleCoinPress(index)}
          />
        </View>
      ))}
      <GhostCoin style={{
        ...ghostPos,
        backgroundColor: ghostColor,
        opacity: ghostColor ? ghostOpacity : 0,
        transform: [
          {translateY: ghostTranslateY}
        ]
      }}>
        <ColorHint
          color={ghostColor}
          size={coinSize / 2}
        />
      </GhostCoin>
    </LevelContainer>
  );
};

export default LevelNewcomerCoin;
