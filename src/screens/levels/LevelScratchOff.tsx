import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ScratchOffCard from './components/LevelScratchOff/ScratchOffCard';
import styles from 'res/styles';

const LevelScratchOff: Level = (props) => {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setTimeout(() => setRendered(true), 50);
  }, []);

  if (!rendered) return (
    <LevelContainer color={colors.coin}>
      <LevelText color={'white'}>Loading...</LevelText>
      {/* <ActivityIndicator
        color={'white'}
        size={styles.coinSize * 3}
      /> */}
    </LevelContainer>
  );
  
  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>Feeling lucky?</LevelText>
      {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
      <ScratchOffCard />
    </LevelContainer>
  );
};

export default LevelScratchOff;
