// TODO: Invert relationship between WhiteKey & WhiteKeyContainer and BlackKey & BlackKeyContainer

import React, { useState, useEffect } from 'react';
import { Animated, Button, Easing, Text, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import { playPiano } from 'utils/playPitch';
import useCongratsMessage from 'hooks/useCongratsMessage';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const whiteHeight = levelHeight / 3;
const whiteWidth = levelWidth / 7;
const blackHeight = whiteHeight * 7 / 12;
const blackWidth = whiteWidth * 137 / 235;
const lambHeight = levelWidth * 699 / 1000; // Adjust for dimensions of image

const Lamb = styled(Animated.Image).attrs({
  source: require('assets/images/lamb.jpg')
})`
  position: absolute;
  left: 0px;
  width: ${levelWidth}px;
  height: ${lambHeight}px;
  z-index: 1;
`;

const PianoContainer = styled(Animated.View)`
  position: absolute;
  left: 0px;
  width: ${levelWidth}px;
  height: ${whiteHeight}px;
  flex-direction: row;
  border: 0px black solid;
  z-index: 1;
`;

const WhiteKeyContainer = styled.View`
`;

const WhiteKey = styled.TouchableHighlight.attrs({
  underlayColor: '#C0C0C0'
})`
  width: ${whiteWidth}px;
  height: ${whiteHeight}px;
  border: 1px black solid;
  background-color: white;
`;

const BlackKeyContainer = styled.View`
  position: absolute;
  z-index: 1;
  left: ${(props: {offset: number}) => props.offset * whiteWidth - blackWidth / 2}px;
`;

const BlackKey = styled.TouchableHighlight.attrs({
  underlayColor: 'black'
})`
  width: ${blackWidth}px;
  height: ${blackHeight}px;
  background-color: #303030;
`;

const LyricsContainer = styled.View`
  width: ${levelWidth}px;
  position: absolute;
  bottom: 0px;
  align-items: center;
`;

const Lyrics = styled(LevelText)`
  text-align: center;
`;

const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const maryIntervals = [-2, -2, 2, 2, 0, 0, -2, 0, 0, 2, 3, 0];
const syllables = ['Ma', 'ry', ' had', ' a', ' lit', 'tle', ' lamb,', ' lit', 'tle', ' lamb,', ' lit', 'tle', ' lamb!'];


const lambInit = -styles.levelNavHeight;
const pianoInit = lambInit + lambHeight;

const coinSize = styles.coinSize;
const coinPositions = notes.map((note: string, index: number) => {
  const whiteKey = note.length === 1;
  if (whiteKey) {
    return ({
      left: Math.floor((index + 1) / 2) * whiteWidth + (whiteWidth - coinSize) / 2,
      top: pianoInit + (whiteHeight + blackHeight - coinSize) / 2
    });
  }
  return ({
    left: Math.floor(index / 2 + 1) * whiteWidth - coinSize / 2,
    top: pianoInit + (blackHeight - coinSize) / 2
  });
});

const LevelPiano: Level = (props) => {
  const [noteIndex, setNoteIndex] = useState(-1);
  const [songIndex, setSongIndex] = useState(-1);
  const [lambTopAnim] = useState(new Animated.Value(lambInit));
  const [pianoTopAnim] = useState(new Animated.Value(pianoInit));
  
  const congratsMessage = useCongratsMessage();

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;
  const lyrics = syllables.slice(0, songIndex + 1).join('');

  // TODO: Consider whether to push piano off-screen or to make it fade to reveal coins
  const handleWin = () => {
    Animated.sequence([
      Animated.timing(lambTopAnim, {
        toValue: lambInit - lambHeight * 2 / 3,
        duration: 1000
      }),
      Animated.timing(lambTopAnim, {
        toValue: lambInit,
        easing: Easing.quad,
        duration: 600
      }),
      Animated.parallel([
        Animated.timing(lambTopAnim, {
          toValue: levelHeight,
          easing: Easing.linear,
          duration: 2000
        }),
        Animated.timing(pianoTopAnim, {
          toValue: levelHeight + lambHeight,
          easing: Easing.linear,
          duration: 2000
        })
      ])
    ]).start();
  };

  const handleNotePress = (note: string, index: number) => {
    playPiano(`${note}4`);
    if (songIndex === maryIntervals.length) return;
    // const validFirst = index >= 4 && index <= 8;
    const validFirst = index === 4;
    if (validFirst && songIndex < 0) {
      setSongIndex(0);
    } else if (index - noteIndex == maryIntervals[songIndex]) {
      if (songIndex + 1 === maryIntervals.length) {
        handleWin();
      }
      setSongIndex(state => state + 1);
    } else if (validFirst) {
      setSongIndex(0);
    } else {
      setSongIndex(-1);
    }
    setNoteIndex(index);
  };

  return (
    <LevelContainer>
      <LevelCounter
        count={numCoinsFound}
        position={{top: 0, right: 0}}
      />
      {twelve && (<>
        <LevelText>{congratsMessage}</LevelText>
        <Button
          title={'Next level!'}
          onPress={() => props.onNextLevel()}
        />
      </>)}
      <Lamb style={{top: lambTopAnim}} />
      <PianoContainer style={{top: pianoTopAnim}}>
        {notes.map((note: string, index: number) => {
          const whiteKey = note.length === 1;
          if (whiteKey) return (
            <WhiteKeyContainer key={String(index)}>
              <WhiteKey onPressIn={() => handleNotePress(note, index)} >
                <Text />
              </WhiteKey>
            </WhiteKeyContainer>
          );
          return (
            <BlackKeyContainer
              key={String(index)}
              offset={Math.floor(index / 2 + 1)}
            >
              <BlackKey onPressIn={() => handleNotePress(note, index)}>
                <Text />
              </BlackKey>
            </BlackKeyContainer>
          );
        })}
      </PianoContainer>
      {notes.map((_, index: number) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPositions[index]}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
      <LyricsContainer>
        <Lyrics>{lyrics}</Lyrics>
      </LyricsContainer>
    </LevelContainer>
  );
};

export default LevelPiano;
