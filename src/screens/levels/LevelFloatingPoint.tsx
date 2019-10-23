import React, { useState, useEffect } from 'react';
import { Animated, Button, Text, TouchableHighlight, Easing } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import useCongratsMessage from 'hooks/useCongratsMessage';
import LevelContainer from 'components/LevelContainer';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const coinSize = styles.coinSize * 4;

const CoinContainer = styled(Animated.View)`
  width: ${coinSize}px;
  height: ${coinSize}px;
  border-radius: ${coinSize / 2}px;
`;

const Coin = styled.TouchableHighlight.attrs({
  children: <Text></Text>
})`
  flex: 1;
  border-radius: ${coinSize / 2}px;
`;

const LevelFloatingPoint: Level = (props) => {
  const [numCoinsFound, setNumCoinsFound] = useState(0);
  const [colorValue, setColorValue] = useState(1);
  const [colorAnim] = useState(new Animated.Value(colorValue));
  const congratsMessage = useCongratsMessage();
  
  colorAnim.addListener(({ value }) => setColorValue(value));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: -1,
          duration: 2000,
          easing: Easing.linear
        }),
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear
        })
      ])
    ).start();
  }, [])
  
  const twelve = numCoinsFound === 12;

  const handleCoinPress = () => {
    const newNumCoinsFound = Math.min(Math.max(numCoinsFound + colorValue, 0), 12);
    if (colorValue < 0 && Math.floor(numCoinsFound) > newNumCoinsFound) {
      const newCoinsFound = props.coinsFound;
      newCoinsFound.delete(Math.floor(newNumCoinsFound));
      props.setCoinsFound(newCoinsFound);
    } else if (colorValue > 0 && Math.floor(newNumCoinsFound) > numCoinsFound) {
      props.onCoinPress(Math.floor(numCoinsFound));
    }
    setNumCoinsFound(newNumCoinsFound);
  };

  const color = colorAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [colors.badCoin, colors.coin]
  });

  return (
    <LevelContainer>
      <LevelCounter
        width={levelWidth}
        count={Math.round(numCoinsFound * 10000) / 10000}
        textStyle={{textAlign: 'center'}}
      />
      {twelve ? (<>
        <LevelText>{congratsMessage}</LevelText>
        <Button
          title={'Next level!'}
          onPress={() => props.onNextLevel()}
        />
      </>) : (
        <CoinContainer style={{backgroundColor: color}}>
          <Coin onPress={handleCoinPress} />
        </CoinContainer>
      )}
    </LevelContainer>
  );
};

export default LevelFloatingPoint;
