// FINAL LEVEL
// "The clues are all in plain sight"
// 12 boxes, all with level numbers
// At each level number indicated, there will be a key character
// Maybe it's idden somewhere or it's bolded/unbolded/italicized/discolored
// The final message will be "thx4playing!"
// Maybe play a cute animation after to transition to credits~ uwu

// TODO: Show coins upon unlocking the message
// 

import React, { useState, useEffect, useRef } from 'react';
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
  blurOnSubmit: false,
})`
  font-family: montserrat-black;
  font-size: ${styles.coinSize * 3/4}px;
  height: ${styles.coinSize * 3/2}px;
  width: ${styles.coinSize * 3/2}px;
  padding: ${styles.coinSize / 4}px;
  text-align: center;
  color: ${colors.darkText};
  background-color: ${colors.lightText};
`;

const LetterInputsContainer = styled.View`
  width: ${levelWidth}px;
  flex-direction: row;
  flex-wrap: wrap;
`;

const LetterInputContainer = styled.View`
  width: ${levelWidth / 4};
  justify-content: center;
  align-items: center;
  padding-top: ${styles.coinSize}px;
`;

// TODO: Replace with actual level numbers
const hints = [37, 53, 63, 54, 68, 42, 3, 15, 25, 51, 2, 17];
const answer = 'thx4playing!';

const messages = [
  `Wow, you did it! You really did it!`,
  `How does it feel? Having bested all the challenges?`,
  `That's all I have for you now.`,
  `This game was a year in the making, and it was a blast to create.`,
  `Maybe I'll add more levels, or maybe I'll work on another game...`,
  `...like eleven?`,
  `Time will tell, and it really depends on how much people enjoyed twelve.`,
  'So remember to give it a rating if you enjoyed it ;)',
  `Also, this game wouldn't have been possible without my friends' music and art.`,
  `So don't forget to check out their links in the credits!`,
  'And thank YOU, once again, for playing...',
  'twelve.',
];

const CoinContainer = styled.View`
  position: absolute;
  right: ${styles.coinSize}px;
  bottom: ${styles.coinSize}px;
`;

const EndMessageText = styled.Text`
  width: 100%;
  padding: 12.5%;
  font-size: ${styles.coinSize * 2 / 3}px;
  color: ${colors.darkText};
  font-family: montserrat;
  text-align: center;
`;

const LevelScavengerHunt: Level = (props) => {

  const [messageChars, setMessageChars] = useState(() => hints.map(() => ''));
  // TODO: Watch this issue: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  const inputs = useRef<Array<any>>(messageChars.map(() => null));

  const message = messageChars.join('');
  const messageFound = message === answer;
  
  const handleTextChange = (index: number) => (newText: string) => {
    setMessageChars(messageChars => [
      ...messageChars.slice(0, index),
      newText.toLowerCase(),
      ...messageChars.slice(index + 1),
    ]);
  };

  const handleSubmitEditing = (index: number) => {

  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      {messageFound ? (
        <>
          <LevelCounter count={numCoinsFound} position={{ left: 0, bottom: 0 }} />
          <EndMessageText>{messages[numCoinsFound]}</EndMessageText>
          <CoinContainer>
            <Coin
              size={styles.coinSize * 2}
              onPress={() => props.onCoinPress()}
            />
          </CoinContainer>
        </>
      ) : (
        <>
          <LevelText>{message}</LevelText>
          <LetterInputsContainer>
            {messageChars.map((messageChar, index) => (
              <LetterInput
                key={String(index)}
                // value={messageChar}
                ref={ref => inputs.current[index] = ref}
                onChangeText={handleTextChange(index)}
                placeholder={String(hints[index])}
                onSubmitEditing={() => inputs.current[index + 1]?.focus()}
              />
            ))}
          </LetterInputsContainer>
        </>
      )}
    </LevelContainer>
  );
};

export default LevelScavengerHunt;
