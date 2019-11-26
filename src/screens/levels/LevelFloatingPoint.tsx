// TODO: Add colorblind option for this level

import React, { useState, useEffect } from 'react';
import { Animated, Button, Easing, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import Coin from 'components/Coin';
import LevelContainer from 'components/LevelContainer';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ColorHint from 'components/ColorHint';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const coinSize = styles.coinSize * 4;

const CoinColoring = styled(Animated.View)`
  width: 100%;
  height: 100%;
  border-radius: ${coinSize / 2}px;
  background-color: ${colors.badCoin};
  justify-content: center;
  align-items: center;
`;

// const CoinContainer = styled.View`
//   background-color: white;
//   width: ${coinSize}px;
//   height: ${coinSize}px;
//   border-radius: ${coinSize / 2}px;
// `;

// const CoinTouchable = styled.TouchableOpacity.attrs({
//   activeOpacity: 0.75
// })`
//   flex: 1;
//   border-radius: ${coinSize / 2}px;
// `;

// const Coin = styled(Animated.View)`
//   flex: 1;
//   border-radius: ${coinSize / 2}px;
// `;

const LevelFloatingPoint: Level = (props) => {
  const [numCoinsFound, setNumCoinsFound] = useState(0);
  const [redOpacity, setRedOpacity] = useState(0);
  const [redOpacityAnim] = useState(new Animated.Value(redOpacity));
  
  
  useEffect(() => {
    const listener = redOpacityAnim.addListener(
      ({ value }) => setRedOpacity(value)
    );
    Animated.loop(
      Animated.sequence([
        Animated.timing(redOpacityAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear
        }),
        Animated.timing(redOpacityAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear
        })
      ])
    ).start();
    return () => redOpacityAnim.removeListener(listener);
  }, [])
  
  const twelve = numCoinsFound === 12;

  const handleCoinPress = () => {
    const newNumCoinsFound = Math.min(
      12,
      Math.max(0, numCoinsFound + (0.5 - redOpacity) * 2)
    );
    if (redOpacity >= 0.5 && Math.floor(numCoinsFound) > newNumCoinsFound) {
      const newCoinsFound = props.coinsFound;
      newCoinsFound.delete(Math.floor(newNumCoinsFound));
      props.setCoinsFound(newCoinsFound);
    } else if (redOpacity < 0.5 && Math.floor(newNumCoinsFound) > numCoinsFound) {
      props.onCoinPress(Math.floor(numCoinsFound));
    }
    setNumCoinsFound(newNumCoinsFound);
  };

  return (
    <LevelContainer>
      <LevelCounter
        width={levelWidth}
        count={Math.round(numCoinsFound * 10000) / 10000}
        textStyle={{textAlign: 'center'}}
      />
      <Coin
        size={coinSize}
        onPress={handleCoinPress}
      >
        <CoinColoring style={{
          opacity: redOpacityAnim
        }}>
          <ColorHint
            color={colors.badCoin}
            size={coinSize / 2}
          />
        </CoinColoring>
      </Coin>
      {/* <CoinContainer>
        <CoinTouchable onPress={handleCoinPress}>
          <Coin style={{backgroundColor: color}} />
        </CoinTouchable>
      </CoinContainer> */}
    </LevelContainer>
  );
};

export default LevelFloatingPoint;
