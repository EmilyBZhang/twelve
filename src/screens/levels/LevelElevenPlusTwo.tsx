import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import useSelectedIndices from 'hooks/useSelectedIndices';
import styles from 'assets/styles';
import colors from 'assets/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const LetterTouchable = styled.TouchableOpacity`
  opacity: ${props => props.disabled ? 0.5 : 1};
  justify-content: center;
  align-items: center;
`;

const Letter = styled.Text`
  font-family: montserrat-black;
  font-size: ${styles.coinSize}px;
  color: ${colors.foreground};
  padding-left: ${styles.coinSize / 9}px;
  padding-right: ${styles.coinSize / 9}px;
  min-width: ${styles.coinSize}px;
  text-align: center;
`;

const WordContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

interface CoinContainerProps {
  early?: boolean;
}

const CoinContainer = styled.View<CoinContainerProps>`
  position: absolute;
  z-index: 1;
`;

const touchableLetters = [
  'two +',
  'eleven',
].map(text => text.split(''));
const targetLetters = [
  'one +',
  'twelve',
].map(text => text.split(''));
const targetMessage = 'one+twelve';

const LevelElevenPlusTwo: Level = (props) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [
    usedLettersIndices,
    toggleUsedLetterIndex,
    setUsedLetterIndices
  ] = useSelectedIndices();

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const madeMessage = messageIndex === targetMessage.length;

  const handleLetterTouch = (letter: string, index: number) => {
    if (targetMessage[messageIndex] === letter) {
      setMessageIndex(state => state + 1);
      toggleUsedLetterIndex(index);
    } else {
      setMessageIndex((targetMessage[0] === letter) ? 1 : 0);
      setUsedLetterIndices(new Set());
    }
  };

  const renderCoin = (index: number) => (
    <CoinContainer key={String(index)}>
      <Coin
        found={props.coinsFound.has(index)}
        onPress={() => props.onCoinPress(index)}
      />
    </CoinContainer>
  );

  let numLetters = 0;
  const revealedLetters = targetLetters.map((row, rowIndex) => (
    <WordContainer key={String(rowIndex)}>
      {row.map((letter, index) => {
        const showLetter = (letter === ' ') || (messageIndex > numLetters++);
        return (
          <LetterTouchable
            key={String(index)}
            disabled
          >
            <Letter>
              {showLetter ? letter : ' '}
            </Letter>
            {(madeMessage && rowIndex === 1) && (<>
              {renderCoin(index)}
              {renderCoin(index + 6)}
            </>)}
          </LetterTouchable>
        );
      })}
    </WordContainer>
  ));

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {touchableLetters.map((row, rowIndex) => (
        <WordContainer key={String(rowIndex)}>
          {row.map((letter, colIndex) => {
            const index = rowIndex * touchableLetters[0].length + colIndex;
            return (
              <LetterTouchable
                key={String(colIndex)}
                disabled={letter === ' ' || usedLettersIndices.has(index)}
                onPress={() => handleLetterTouch(letter, index)}
              >
                <Letter key={String(colIndex)}>{letter}</Letter>
              </LetterTouchable>
            );
          })}
        </WordContainer>
      ))}
      <LetterTouchable disabled>
        <Letter>=</Letter>
      </LetterTouchable>
      {revealedLetters}
      {/* {madeMessage && coinPositions.map((coinPosition, index: number) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))} */}
    </LevelContainer>
  );
};

export default LevelElevenPlusTwo;
