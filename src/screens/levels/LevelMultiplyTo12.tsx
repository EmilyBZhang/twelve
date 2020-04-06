import React, { useState, useMemo } from 'react';
import { View } from 'react-native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import { shuffleArray } from 'utils/random';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const nums = [0.5, 6, 4, 1, 8, 1.5, 2, -12, 24, 3, 12, -1];
const numsInit = [-12, -1, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 24];

const LevelMultiplyTo12: Level = (props) => {

  const nums = useMemo(() => {
    const nums = numsInit.slice();
    shuffleArray(nums);
    return nums;
  }, []);
  const [lastIndex, setLastIndex] = useState(-1);

  const numCoinsFound = props.coinsFound.size;

  const handleCoinPress = (index: number) => {
    if (numCoinsFound % 2 === 0) {
      setLastIndex(index);
      props.onCoinPress(index);
    } else {
      if (nums[lastIndex] * nums[index] === 12) {
        props.onCoinPress(index);
      } else {
        props.setCoinsFound(new Set());
      }
      setLastIndex(-1);
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
            color={(index === lastIndex) ? colors.badCoin : colors.orderedCoin}
            found={props.coinsFound.has(index) && (index !== lastIndex)}
            onPress={() => handleCoinPress(index)}
            colorHintOpacity={0}
          >
            <LevelText
              color={'black'}
              fontSize={styles.coinSize / 2}
            >
              {nums[index]}
            </LevelText>
          </Coin>
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelMultiplyTo12;
