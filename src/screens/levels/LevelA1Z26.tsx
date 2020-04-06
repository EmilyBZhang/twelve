import React from 'react';

import { Level } from 'utils/interfaces';
import LevelContainer from 'components/LevelContainer';
import LevelCounter from 'components/LevelCounter';
import TwelveWordPicker from './components/LevelA1Z26/TwelveWordPicker';

const LevelA1Z26: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <TwelveWordPicker
        onCoinPress={props.onCoinPress}
      />
    </LevelContainer>
  );
};

export default LevelA1Z26;
