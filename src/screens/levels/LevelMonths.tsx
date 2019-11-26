import React from 'react';
import { View } from 'react-native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

// TODO: Consider using month initials instead of length in days
const daysPerMonth = [
  31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
];
const days = daysPerMonth.slice().sort();

const LevelMonths: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const handleCoinPress = (index: number) => {
    if (days[index] === daysPerMonth[numCoinsFound]) {
      props.onCoinPress(index);
    } else {
      props.setCoinsFound(new Set());
    }
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {coinPositions.map((coinPosition, index) => (
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
      ))}
    </LevelContainer>
  );
};

export default LevelMonths;
