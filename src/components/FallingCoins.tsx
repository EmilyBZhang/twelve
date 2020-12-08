import React, {
  FunctionComponent,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Animated, Easing } from 'react-native';

import getDimensions, { getLevelDimensions } from 'utils/getDimensions';
import { randInt } from 'utils/random';
import styles from 'res/styles';
import Coin from 'components/Coin';
import ScreenContainer from './ScreenContainer';

interface FallingCoinsProps {
  active?: boolean;
  onCoinPress?: (index: number) => any;
  coinsFound?: Set<number>;
}

const { width: windowWidth, height: windowHeight } = getDimensions();

const { coinSize } = styles;

const getRandX = () => randInt(-coinSize, windowWidth);

const getRandStart = () => ({
  x: getRandX(),
  y: -coinSize
});

const getRandEnd = () => ({
  x: getRandX(),
  y: windowHeight
});

const initPosition = {
  position: 'absolute' as 'absolute',
  top: 0,
  left: 0,
};

const FallingCoins: FunctionComponent<FallingCoinsProps> = (props) => {
  const { active = true, onCoinPress, coinsFound } = props;

  const [coinPositions] = useState(() => (
    Array.from(Array(12), () => new Animated.ValueXY(getRandStart()))
  ));
  const loopAnim = useRef(active);

  useEffect(() => {
    loopAnim.current = active;
    if (!loopAnim.current) return;
    const animCoin = (coinPosition: Animated.ValueXY, index: number) => {
      Animated.timing(coinPosition, {
        toValue: getRandEnd(),
        duration: randInt(2000, 5000),
        easing: Easing.linear,
        useNativeDriver: true
      }).start(() => {
        if (loopAnim.current) {
          coinPosition.setValue(getRandStart());
          animCoin(coinPosition, index);
        }
      });
    };
    coinPositions.forEach(animCoin);
    return () => {
      loopAnim.current = false;
    };
  }, [active]);

  return (
    <ScreenContainer color={'transparent'} pointerEvents={'box-none'}>
      {coinPositions.map((coinPosition, index) => {
        const { left: translateX, top: translateY } = coinPosition.getLayout();
        return (
          <Animated.View
            key={String(index)}
            style={{
              ...initPosition,
              opacity: 0.5,
              transform: [{translateX}, {translateY}],
            }}
          >
            <Coin
              onPress={onCoinPress && (() => onCoinPress(index))}
              found={coinsFound?.has(index)}
            />
          </Animated.View>
        );
      })}
    </ScreenContainer>
  );
};

export default memo(FallingCoins);
