// FINAL LEVEL
// "The clues are all in plain sight"
// 12 boxes, all with level numbers
// At each level number indicated, there will be a key character
// Maybe it's idden somewhere or it's bolded/unbolded/italicized/discolored
// The final message will be "thx4playing!"
// Maybe play a cute animation after to transition to credits~ uwu

// TODO: Show coins upon unlocking the message
// 

import React, { useState, useEffect } from 'react';
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

const LetterInput = styled.TextInput.attrs({
  autoCapitalize: 'none',
  autoCorrect: false,
  caretHidden: false,
  maxLength: 1,
})`
  font-family: montserrat-black;
  font-size: ${styles.coinSize * 3/4}px;
  height: ${styles.coinSize * 3/2}px;
  width: ${styles.coinSize * 3/2}px;
  padding: ${styles.coinSize / 4}px;
  text-align: center;
  text-transform: lowercase;
  color: ${colors.darkText};
  background-color: ${colors.lightText};
`;

const LetterInputsContainer = styled.View`
  width: ${levelWidth};
  flex-direction: row;
  flex-wrap: wrap;
`;

const LetterInputContainer = styled.View`
  width: ${levelWidth / 4};
  justify-content: center;
  align-items: center;
  padding-top: ${styles.coinSize}px;
`;

// TODO: Replace with actual 
const hints = [64, 3, 7, 18, 42, 12, 55, 39, 30, 26, 11, 61];
const answer = 'thx4playing!';

const LevelScavengerHunt: Level = (props) => {

  const [messageChars, setMessageChars] = useState(() => hints.map(() => ''));

  const message = messageChars.join('');
  const messageFound = message === answer;
  
  useEffect(() => {
    if (!messageFound) return;
    props.setCoinsFound(new Set([0,1,2,3,4,5,6,7,8,9,10,11]));
  }, [messageFound]);

  const handleTextChange = (index: number) => (newText: string) => {
    setMessageChars(messageChars => [
      ...messageChars.slice(0, index),
      newText.toLowerCase(),
      ...messageChars.slice(index + 1),
    ]);
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LetterInputsContainer>
        {messageChars.map((messageChar, index) => (
          <LetterInput
            value={messageChar}
            onChangeText={handleTextChange(index)}
            placeholder={String(hints[index])}
          />
        ))}
      </LetterInputsContainer>
      <LevelText>{message}</LevelText>
    </LevelContainer>
  );
};

export default LevelScavengerHunt;
