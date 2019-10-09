import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StatusBar, StyleSheet, View, Text } from 'react-native';
import styled from 'styled-components/native';

import colors from '../assets/colors';

interface CoinProps {
  onPress: () => any;
  size?: number;
  disabled?: boolean;
  hidden?: boolean;
  found?: boolean;
}

const CoinTouchable = styled.TouchableHighlight<CoinProps>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.hidden || props.found ? 'transparent' : colors.coin};
  border-radius: ${props => props.size! / 2}px;
  ${props => props.found && 'display: none;'}
`;

const Coin: FunctionComponent<CoinProps> = (props) => {
  const size = props.size ? props.size : 16;

  const handleCoinPress = () => {
    props.onPress();
  }
  return (
    <CoinTouchable
      size={size}
      onPress={props.onPress}
      found={props.found}
      hidden={props.hidden}
      disabled={props.disabled || props.found}
    >
      <Text></Text>
    </CoinTouchable>
  );
}

export default Coin;
