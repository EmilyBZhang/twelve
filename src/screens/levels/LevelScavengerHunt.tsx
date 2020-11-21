// FINAL LEVEL
// "The clues are all in plain sight"
// 12 boxes, all with level numbers
// At each level number indicated, there will be a key character
// Maybe it's idden somewhere or it's bolded/unbolded/italicized/discolored
// The final message will be "thx4playing!"
// Maybe play a cute animation after to transition to credits~ uwu

import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const LetterInput = styled.TextInput``;

const LevelScavengerHunt: Level = (props) => {

  const [text, setText] = useState('');

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <TextInput
        style={{fontFamily: 'montserrat-black', fontSize: 24, backgroundColor: 'white', padding: 12}}
        autoCapitalize={'none'}
        autoCorrect={false}
        caretHidden={false}
        maxLength={1}
        onChangeText={setText}
      />
      <LevelText>{text}</LevelText>
    </LevelContainer>
  );
};

export default LevelScavengerHunt;

