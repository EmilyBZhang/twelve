import React, { FunctionComponent, memo } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

import colors, { CoinColor, coinUnderlayColors } from 'assets/colors';
import styles from 'assets/styles';

export interface CoinProps {
  onPress: () => any;
  size?: number;
  color?: CoinColor;
  disabled?: boolean;
  hidden?: boolean;
  found?: boolean;
  label?: string;
  children?: any;
}
export type CoinType = FunctionComponent<CoinProps>;

const CoinTouchable = styled.TouchableHighlight<CoinProps>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => (props.hidden || props.found) ? 'transparent' : props.color};
  border-radius: ${props => props.size! / 2}px;
  justify-content: center;
  align-items: center;
  ${props => props.found && 'display: none;'}
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
    children,
    label
  } = props;

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
      {children || <Text>{label}</Text>}
    </CoinTouchable>
  );
}

export default memo(Coin);
