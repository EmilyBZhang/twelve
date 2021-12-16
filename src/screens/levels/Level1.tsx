import React from 'react';
import { View } from 'react-native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const frames = [
  [4],
  [3, 4, 5],
  [0, 3, 4, 5],
  [0, 1, 3, 4, 5],
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 5, 6, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 9, 10],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
];

const Level1: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      {/* Comment out the next two lines for taking Intro screenshots */}
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>twelve</LevelText>
      {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
            // Replace the next line's index for Intro screenshots
            hidden={!frames[7].includes(index)}
          />
        </View>
      ))}
    </LevelContainer>
  );
};

export default Level1;
