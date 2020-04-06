import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import Calendar from './components/LevelMonths/Calendar';

// TODO: Consider using month initials instead of length in days
const daysPerMonth = [
  31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
];
const days = daysPerMonth.slice().sort();

const dayLabels = [28, 30, 31];

const CoinOptionsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;
`;

const LevelMonths: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = (value: number) => {
    if (value === daysPerMonth[numCoinsFound]) {
      props.onCoinPress(numCoinsFound);
    } else {
      props.setCoinsFound(new Set());
    }
  };

  const renderCoin = (value: number) => (
    <Coin
      key={String(value)}
      size={styles.coinSize * 1.5}
      color={colors.orderedCoin}
      onPress={() => handleCoinPress(value)}
      colorHintOpacity={0}
    >
      <LevelText
        color={'black'}
        fontSize={styles.coinSize / 2}
      >
        {value}
      </LevelText>
    </Coin>
  );

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {/* {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            color={colors.orderedCoin}
            found={props.coinsFound.has(index)}
            onPress={() => handleCoinPress(index)}
            colorHintOpacity={0}
          >
            <LevelText
              color={'black'}
              fontSize={styles.coinSize / 2}
            >
              {days[index]}
            </LevelText>
          </Coin>
        </View>
      ))} */}
      <CoinOptionsContainer>
        {dayLabels.map((dayLabel, index) => renderCoin(dayLabel))}
      </CoinOptionsContainer>
      <Calendar numCompleted={numCoinsFound} />
    </LevelContainer>
  );
};

export default LevelMonths;
