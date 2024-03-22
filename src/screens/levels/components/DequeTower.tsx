import styled from 'styled-components/native';

import styles from 'res/styles';
import LevelText from 'components/LevelText';

const { coinSize } = styles;

interface DequeTowerProps {
  active?: boolean;
  isQueue?: boolean;
}

export const DequeTower = styled.TouchableOpacity<DequeTowerProps>`
  background-color: ${props => props.active ? '#00800080' : '#ffffff80'};
  border-width: 2px;
  border-color: #00000080;
  ${props => props.isQueue ? `
    border-left-width: 0px;
    border-right-width: 0px;
  ` : `
    border-radius: ${coinSize}px;
  `}
  flex-direction: row;
  width: ${coinSize * 7}px;
  height: ${coinSize * 2}px;
  padding: ${coinSize / 2}px;
  margin: ${coinSize / 2}px;
`;

export const Letter = styled(LevelText).attrs({
  fontSize: coinSize * 2 / 3
})`
  width: ${coinSize}px;
  height: ${coinSize}px;
`;

export default DequeTower;
