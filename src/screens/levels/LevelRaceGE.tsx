import React, { useState, useEffect } from 'react';
import { Animated, Easing, View } from 'react-native';
import {
  GameLoop,
  GameLoopUpdateEventOptionType,
  GameLoopUpdate
} from 'react-native-game-engine';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import getDimensions, { getLevelDimensions } from 'utils/getDimensions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import styles from 'res/styles';

const { width: screenWidth, height: screenHeight } = getDimensions();
const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const numLanes = 4;
const cycleTime = 5000;
const y0 = levelHeight;
const y1 = -styles.levelNavHeight;
const translateYUnit = (y1 - y0) / (cycleTime / 16);
const racerIds = Array.from(Array(numLanes), (_, index) => index + 9);
const multipliers = racerIds.map(racerId => 144 / Math.pow(racerId, 2));

interface LaneProps {
  isWinner: boolean;
}

const Lane = styled.View<LaneProps>`
  height: ${levelHeight}px;
  width: ${levelWidth / numLanes}px;
  background-color: ${props => props.isWinner ? '#ffff0040' : '#00000040'};
  border-right-width: 1px;
  justify-content: flex-end;
`;

const Racer = styled(Animated.View)``;

const LanesContainer = styled.View`
  flex-direction: row;
`;

const getLane = (x: number) => Math.floor(x / screenWidth * numLanes);

const LevelRaceGE: Level = (props) => {

  const [yVals, setYVals] = useState(() => racerIds.map(() => y0));
  const [numTouches, setNumTouches] = useState(() => racerIds.map(() => 0));
  const [winner, setWinner] = useState(-1);
  const [lastTime, setLastTime] = useState(new Date().getTime());

  // TODO: The type declaration for this is messed up in RNGE; check for updates
  const handleUpdate = (args?: GameLoopUpdateEventOptionType) => {
    const { time, touches } = args as GameLoopUpdate;
    setNumTouches(numTouches => {
      const newNumTouches = [...numTouches];
      touches.forEach(touch => {
        const lane = getLane(touch.event.pageX);
        switch (touch.type) {
          case 'end': {
            newNumTouches[lane]--;
            break;
          }
          case 'start': {
            newNumTouches[lane]++;
            break;
          }
          case 'move': {
            const oldX = touch.event.pageX - touch.delta!.pageX;
            const oldLane = getLane(oldX);
            newNumTouches[lane]++;
            newNumTouches[oldLane]--;
            break;
          }
        }
      });
      const currTime = new Date().getTime();
      setYVals(yVals => {
        const newYVals = [...yVals];
        let newWinner = winner;
        newNumTouches.forEach((numTouches, index) => {
          if (currTime >= lastTime + cycleTime) {
            newYVals[index] = y0;
            setLastTime(currTime);
            newWinner = -1;
            return;
          }
          const speed = (numTouches > 0) ? 2 : 1;
          newYVals[index] += translateYUnit * time.delta / 16 * speed;
          if (winner === -1 && newYVals[index] < 0) {
            newWinner = index;
            console.log(newYVals[index]);
          }
        });
        setWinner(newWinner);
        return newYVals;
      });
      return newNumTouches;
    });
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} position={{}} />
      <GameLoop onUpdate={handleUpdate}>
        <LanesContainer>
          {racerIds.map((racerId, index) => {
            return (
              <Lane
                key={String(racerId)}
                isWinner={winner === index}
              >
                {/* <Racer style={{transform: [{ translateY: translateY[index] }]}}> */}
                <View style={{
                  backgroundColor: 'pink',
                  position: 'absolute',
                  top: yVals[index]
                }}>
                  <LevelText>{racerId}</LevelText>
                </View>
                {/* </Racer> */}
              </Lane>
            );
          })}
          </LanesContainer>
      </GameLoop>
    </LevelContainer>
  );
};

export default LevelRaceGE;
