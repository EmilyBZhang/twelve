import React from 'react';
import { View } from 'react-native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const LevelWarning: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelText hidden={twelve}>
        WARNING: All levels afterward are purely
        experimental and are not complete!
      </LevelText>
    </LevelContainer>
  );
};

export default LevelWarning;
