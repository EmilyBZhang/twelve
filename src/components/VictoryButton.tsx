import styled from 'styled-components/native';

import colors from 'res/colors';
import styles from 'res/styles';

export const LargeVictoryButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  background-color: ${colors.foreground};
  padding: ${styles.coinSize / 2}px;
  border-radius: ${styles.coinSize}px;
  margin: ${styles.coinSize / 2}px;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

export const LargeVictoryButtonText = styled.Text`
  font-size: ${styles.coinSize / 2}px;
  font-family: montserrat-bold;
  color: ${colors.lightText};
  text-align: center;
`;

export const SmallVictoryButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  background-color: ${colors.foreground};
  padding: ${styles.coinSize / 3}px;
  border-radius: ${styles.coinSize * 2 / 3}px;
  margin: ${styles.coinSize / 4}px ${styles.coinSize / 2}px;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

export const SmallVictoryButtonText = styled.Text`
  font-size: ${styles.coinSize / 3}px;
  font-family: montserrat-bold;
  color: ${colors.lightText};
  text-align: center;
`;

export default LargeVictoryButton;
