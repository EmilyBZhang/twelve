import React from 'react';

import { Level } from 'utils/interfaces';
import LevelContainer from 'components/LevelContainer';
import LevelCounter from 'components/LevelCounter';
import TwelveWordPicker from './components/LevelA1Z26/TwelveWordPicker';

const LevelSpellTwelve: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <TwelveWordPicker
        showLetter
        onCoinPress={props.onCoinPress}
      />
    </LevelContainer>
  );
};

export default LevelSpellTwelve;
