import { Animated } from 'react-native';
import styled from 'styled-components';

import styles from 'assets/styles';

const coinSize = styles.coinSize;

interface BitColorProps {
  square?: boolean;
  coinSize?: number;
}

export const BitColor = styled(Animated.View)<BitColorProps>`
  width: ${props => props.coinSize || coinSize}px;
  height: ${props => props.coinSize || coinSize}px;
  ${props => !props.square && `borderRadius: ${props.coinSize || coinSize / 2}px;`}
  justify-content: center;
  align-items: center;
`;
