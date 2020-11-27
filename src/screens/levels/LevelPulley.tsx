import React, { FunctionComponent, useState } from 'react';
import { Animated } from 'react-native';
import {
  State,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const pulleyHeight = levelHeight * 4;
const pulleyWidth = styles.coinSize;

const PulleysContainer = styled.View`
  position: absolute;
  width: ${levelWidth}px;
  height: ${levelHeight}px;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const PulleyContainer = styled(Animated.View)`
  height: ${pulleyHeight}px;
  width: ${pulleyWidth * 2}px;
  align-items: center;
`;

const Pulley = styled(LinearGradient).attrs({
  colors: [colors.badCoin, colors.coin],
})`
  height: ${pulleyHeight}px;
  width: ${pulleyWidth}px;
  border-radius: ${pulleyWidth / 2}px;
  justify-content: flex-end;
`;

const CoinContainer = styled.View`
  position: absolute;
`;

const ReversedView = styled.View`
  transform: scaleY(-1);
`;

const LevelPulley: Level = (props) => {

  const [baseY] = useState(new Animated.Value(pulleyHeight / 2 - levelHeight));
  const [panY] = useState(new Animated.Value(0));

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY }}], { useNativeDriver: true }
  );

  const handleGestureEventReverse = (e: PanGestureHandlerGestureEvent) => {
    panY.setValue(-e.nativeEvent.translationY);
  };

  const handleStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === State.END) {
      panY.setValue(0);
      baseY.setOffset(e.nativeEvent.translationY);
      baseY.flattenOffset();
    }
  };

  const handleStateChangeReverse = (e: PanGestureHandlerStateChangeEvent) => {
    e.nativeEvent.translationY *= -1;
    handleStateChange(e);
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const coin = <Coin found={twelve} onPress={() => props.onCoinPress(numCoinsFound)} />;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <PulleysContainer>
        <PanGestureHandler
          onGestureEvent={handleGestureEvent}
          onHandlerStateChange={handleStateChange}
        >
          <PulleyContainer style={{
            transform: [{ translateY: Animated.add(baseY, panY) }]
          }}>
            <Pulley>{coin}</Pulley>
          </PulleyContainer>
        </PanGestureHandler>
        <PanGestureHandler
          onGestureEvent={handleGestureEventReverse}
          onHandlerStateChange={handleStateChangeReverse}
        >
          <PulleyContainer style={{ transform: [
            { scaleY: -1 },
            { translateY: Animated.add(
                Animated.add(baseY, panY),
                levelHeight + styles.levelNavHeight * 2 + styles.coinSize
              ) }]
          }}>
            <Pulley>{coin}</Pulley>
          </PulleyContainer>
        </PanGestureHandler>
      </PulleysContainer>
    </LevelContainer>
  );
};

export default LevelPulley;
