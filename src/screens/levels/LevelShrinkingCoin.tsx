import React from 'react';

import { Level } from 'utils/interfaces';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import { getLevelDimensions } from 'utils/getDimensions';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const LevelShrinkingCoin: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <Coin
        onPress={() => props.onCoinPress(numCoinsFound)}
        size={levelHeight * 2 * Math.pow(11 / 12, numCoinsFound)}
        disabled={twelve}
        colorHintOpacity={0}
      />
    </LevelContainer>
  );
};

export default LevelShrinkingCoin;
