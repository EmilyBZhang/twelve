import styled from 'styled-components/native';

import colors from 'res/colors';
import styles from 'res/styles';

export const LargeVictoryButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  background-color: ${colors.foreground};
  padding: ${styles.coinSize / 2}px;
  border-radius: ${styles.coinSize}px;
  margin: ${styles.coinSize}px;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

export const LargeVictoryButtonText = styled.Text`
  font-size: ${styles.coinSize / 2}px;
  font-family: montserrat-bold;
  color: ${colors.lightText};
  text-align: center;
`;

export default LargeVictoryButton;
