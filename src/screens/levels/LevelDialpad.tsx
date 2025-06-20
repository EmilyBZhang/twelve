import React, { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
import ScavengerText from 'components/ScavengerText';
import { playPhoneTone } from 'utils/playPitch';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const coinSize = styles.coinSize * 1.5;
const coinPadding = coinSize / 4;
const rowSize = Math.ceil((coinSize + coinPadding * 2) * 3);

const CoinContainer = styled.View`
  padding: ${coinPadding}px;
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: ${rowSize}px;
`;

const keyLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
const keyLetters = [
  [],
  ['a', 'b', 'c'],
  ['d', 'e', 'f'],
  ['g', 'h', 'i'],
  ['j', 'k', 'l'],
  ['m', 'n', 'o'],
  ['p', 'q', 'r', 's'],
  ['t', 'u', 'v'],
  ['w', 'x', 'y', 'z'],
  [],
  [],
  [],
];

const DisplayText = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: montserrat-extra-bold;
  font-size: ${coinSize * 2 / 3}px;
  color: ${colors.darkText};
  width: 100%;
  flex: 1;
`;

const TextContainer = styled.View`
  flex-direction: row;
  width: ${levelWidth}px;
  overflow: hidden;
  justify-content: flex-start;
  align-items: center;
  background-color: ${colors.plainSurface};
  padding-left: ${styles.coinSize / 2}px;
`;

const TempLetter = styled.Text`
  text-decoration: underline solid;
  color: ${colors.darkText}ea;
`;

const BackspaceTouchable = styled.TouchableOpacity`
  padding: ${styles.coinSize / 2}px;
`;

const BackspaceIcon = styled(MaterialCommunityIcons).attrs({
  name: 'backspace',
  size: coinSize / 2,
  color: colors.foreground,
})``;

const CoinsContainer = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: ${colors.background};
`;

const LevelDialpad: Level = (props) => {
  const [message, setMessage] = useState('');
  const [keyIndex, setKeyIndex] = useState(-1);
  const [letterIndex, setLetterIndex] = useState(-1);
  const [coinsRevealed, setCoinsRevealed] = useState(false);

  const [anim] = useState(new Animated.Value(0));

  const lastUpdated = useRef<Date | null>(null);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  const lastLetter = ((keyIndex !== -1) && (letterIndex !== -1))
    ? keyLetters[keyIndex][letterIndex]
    : '';

  useEffect(() => {
    if (lastLetter !== 'e') return;
    if (message === 'twelv') setCoinsRevealed(true);
  }, [lastLetter]);

  useEffect(() => {
    if (!coinsRevealed) return;
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [coinsRevealed]);

  const handlePress = (index: number) => {
    playPhoneTone(keyLabels[index]);
    const currDate = new Date();
    lastUpdated.current = currDate;
    if ((letterIndex !== -1) && (index !== keyIndex)) {
      setMessage(message => message + keyLetters[keyIndex][letterIndex]);
    }
    setKeyIndex(index);
    if (!keyLetters[index]?.length) {
      setLetterIndex(-1);
      return;
    };
    const newLetterIndex = (index === keyIndex) ? (letterIndex + 1) % keyLetters[index].length : 0;
    setLetterIndex(newLetterIndex);
    setTimeout(() => {
      if (lastUpdated.current === currDate) {
        setMessage(message => message + keyLetters[index][newLetterIndex]);
        setKeyIndex(-1);
        setLetterIndex(-1);
      }
    }, 1000);
  };

  const handleBackspace = () => {
    if (!message && (letterIndex === -1)) return;
    lastUpdated.current = new Date();
    if (letterIndex !== -1) {
      setLetterIndex(-1);
      setKeyIndex(-1);
    } else {
      setMessage(message => message.slice(0, message.length - 1));
    }
  };

  const handleClear = () => {
    lastUpdated.current = new Date();
    setLetterIndex(-1);
    setKeyIndex(-1);
    setMessage('');
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <TextContainer>
        <DisplayText>{message}<TempLetter>{lastLetter}</TempLetter></DisplayText>
        <BackspaceTouchable onPress={handleBackspace} onLongPress={handleClear}>
          <BackspaceIcon />
        </BackspaceTouchable>
      </TextContainer>
      <Grid>
        {keyLabels.map((keyLabel, index) => (
          <CoinContainer key={String(index)}>
            <Coin
              size={coinSize}
              color={colors.orderedCoin}
              colorHintOpacity={0}
              onPress={() => handlePress(index)}
            >
              <LevelText color={colors.darkText}>
                {keyLabel === '4' ? <ScavengerText>{keyLabel}</ScavengerText> : keyLabel}
              </LevelText>
            </Coin>
          </CoinContainer>
        ))}
        {coinsRevealed && (
          <CoinsContainer style={{ opacity: anim }}>
            {Array.from(Array(12), (_, index) => (
              <CoinContainer key={String(index)}>
                <Coin
                  size={coinSize}
                  hidden={props.coinsFound.has(index)}
                  disabled={props.coinsFound.has(index)}
                  onPress={() => props.onCoinPress(index)}
                />
              </CoinContainer>
            ))}
          </CoinsContainer>
        )}
      </Grid>
    </LevelContainer>
  );
};

export default LevelDialpad;
