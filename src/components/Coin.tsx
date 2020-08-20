import React, { FunctionComponent, memo, useState, useEffect } from 'react';
import { Animated, Text, Easing } from 'react-native';
import styled from 'styled-components/native';

import colors, { CoinColor, coinUnderlayColors } from 'assets/colors';
import styles from 'assets/styles';
import ColorHint from 'components/ColorHint';

export interface CoinProps {
  onPress?: () => any;
  size?: number;
  color?: CoinColor;
  disabled?: boolean;
  hidden?: boolean;
  found?: boolean;
  noShimmer?: boolean;
  label?: string;
  children?: any;
  colorHintOpacity?: number;
}
export type CoinType = FunctionComponent<CoinProps>;

const CoinTouchable = styled.TouchableHighlight<CoinProps>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => (props.hidden || props.found) ? 'transparent' : props.color};
  opacity: ${props => props.disabled ? colors.disabledCoinOpacity : 1};
  border-radius: ${props => props.size! / 2}px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  ${props => props.found && 'display: none;'}
`;

const Shimmer = styled(Animated.View)<CoinProps>`
  position: absolute;
  background-color: lightgray;
  opacity: 0.5;
  height: ${props => props.size! / 4}px;
  width: ${props => props.size}px;
`;

// TODO: Consider removing label prop
const Coin: CoinType = (props) => {
  const {
    size = styles.coinSize,
    color = colors.coin,
    onPress,
    found,
    hidden,
    disabled,
    noShimmer,
    children,
    label,
    colorHintOpacity = (props.hidden || props.found) ? 0 : 1
  } = props;

  const [shimmerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 12000,
        easing: t => Easing.inOut(Easing.ease)(Math.max((t * 12 - 11), 0)),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerRadius = (size * (Math.SQRT2 + 0.5) / 4);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerRadius, shimmerRadius]
  });

  return (
    <CoinTouchable
      size={size}
      color={color}
      onPress={onPress}
      found={found}
      hidden={hidden}
      disabled={disabled || found}
      underlayColor={coinUnderlayColors[color]}
    >
      <>
        {(!hidden && !disabled && !found && !noShimmer) && (
          <Shimmer size={size} style={{
            transform: [
              {translateX: shimmerTranslate},
              {translateY: shimmerTranslate},
              {rotate: '-45deg'},
            ]
          }} />
        )}
        {!!colorHintOpacity && (
          <ColorHint
            color={color}
            size={size / 2}
            opacity={colorHintOpacity}
          />
        )}
        {children || <Text>{label}</Text>}
      </>
    </CoinTouchable>
  );
}

export default memo(Coin);
