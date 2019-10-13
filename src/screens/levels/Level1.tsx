import React, { useState } from 'react';
import { Button, View } from 'react-native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import getCongratsMessage from 'utils/getCongratsMessage';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const Level1: Level = (props) => {
  const [congratsMessage] = useState<string>(() => getCongratsMessage());

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText>
        {twelve ? congratsMessage : 'twelve'}
      </LevelText>
      {twelve && (
        <Button
          title='Next level!'
          onPress={() => props.onNextLevel()}
        />
      )}
      {Array(12).fill(null).map((_, index: number) => (
        <View style={{position: 'absolute', ...coinPositions[index]}} key={String(index)}>
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
    </LevelContainer>
  );
};

export default Level1;
