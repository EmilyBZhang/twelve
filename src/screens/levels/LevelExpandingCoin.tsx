import React from 'react';
import { View } from 'react-native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import styles from 'res/styles';

const coinSize = styles.coinSize;

const LevelExpandingCoin: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <Coin
        onPress={() => props.onCoinPress(numCoinsFound)}
        size={coinSize * Math.pow(13 / 12, numCoinsFound)}
      />
    </LevelContainer>
  );
};

export default LevelExpandingCoin;
