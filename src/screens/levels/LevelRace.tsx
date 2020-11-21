// TODO: Consider using a game engine for this level
// UPDATE: I hate this. Why did I make everything so functional?

import React, { useState, useEffect } from 'react';
import { Animated, Easing, View } from 'react-native';
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
const racerIds = Array.from(Array(numLanes), (_, index) => index + 9);
const multipliers = racerIds.map(racerId => 144 / Math.pow(racerId, 2));

const Lane = styled.TouchableOpacity`
  height: ${levelHeight}px;
  width: ${levelWidth / numLanes}px;
  background-color: #00000040;
  border-right-width: 1px;
  justify-content: flex-end;
`;

const Racer = styled(Animated.View)``;

const LanesContainer = styled.View`
  flex-direction: row;
`;

interface BoostInfo {
  isActive: boolean;
  lastTime: number;
  boostTime: number;
}


const LevelRace: Level = (props) => {

  const [lastCycle, setLastCycle] = useState(new Date().getTime());
  const [boosts, setBoosts] = useState<Array<BoostInfo>>(() => (
    racerIds.map(() => ({
      isActive: false,
      lastTime: new Date().getTime(),
      boostTime: 0,
    }))
  ));
  const [projectedWinner, setProjectedWinner] = useState({
    winner: racerIds[0],
    time: lastCycle + cycleTime * multipliers[0]
  });
  const [raceAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    let loopActive = true;
    let anim: Animated.CompositeAnimation | null = null;
    const loopAnim = () => {
      anim = Animated.timing(raceAnim, {
        toValue: 1,
        duration: cycleTime,
        easing: Easing.linear,
        useNativeDriver: true,
      })
      anim.start(() => {
        if (!loopActive) return;
        setLastCycle(new Date().getTime());
        // TODO: See who won race
        raceAnim.setValue(0);
        setBoosts(boosts => {
          const currTime = new Date().getTime();
          const newBoosts = boosts.map(boost => ({
            isActive: boost.isActive,
            lastTime: currTime,
            boostTime: 0,
          }));
          updateProjectedWinner(newBoosts);
          return newBoosts;
        });
        // console.log('WINNER FROM LAST ROUND: ', projectedWinner);
        loopAnim();
      });
    };
    loopAnim();
    return () => {
      loopActive = false;
      anim?.stop();
    };
  }, []);

  useEffect(() => {
    console.log('New projected winner');
    console.log(projectedWinner);
  }, [projectedWinner]);

  const updateProjectedWinner = (boosts: Array<BoostInfo>) => {
    console.log(new Date(), 'I AM ONCE AGAIN ASKING FOR YOUR FIN SUP')

    const calcProjectedTime = (boost: BoostInfo) => {
      const { isActive, boostTime, lastTime } = boost;
      if (isActive) {
        const remainTime = cycleTime - (lastTime - lastCycle);
        return cycleTime - (boostTime + remainTime) / 2;
        // const projTime0 = lastCycle + cycleTime - boostTime;
        // return projTime0 * ((1 + p) / 2);
      }
      return cycleTime - boostTime / 2;
    };

    console.log(boosts.map((boost, index) => multipliers[index] * calcProjectedTime(boost)))

    setProjectedWinner(projectedWinner => {
      const currTime = new Date().getTime();
      if (projectedWinner.time < currTime && projectedWinner.time >= lastCycle)
        return projectedWinner;
      const BEST = boosts.reduce((best, boost, index) => {
        const t = lastCycle + calcProjectedTime(boost) * multipliers[index];
        return (t < best.time) ? { time: t, winner: racerIds[index] } : best;
      }, { time: Infinity, winner: 0 });
      console.log(BEST);
      return BEST;
    });
  };

  const handleLanePressIn = (index: number) => {
    setBoosts(boosts => {
      const newBoosts = [
        ...boosts.slice(0, index),
        {
          isActive: true,
          lastTime: new Date().getTime(),
          boostTime: boosts[index].boostTime,
        },
        ...boosts.slice(index + 1),
      ];
      updateProjectedWinner(newBoosts);
      return newBoosts;
    });
  };

  const handleLanePressOut = (index: number) => {
    setBoosts(boosts => {
      const deltaTime = new Date().getTime() - boosts[index].lastTime;
      const newBoosts = [
        ...boosts.slice(0, index),
        {
          isActive: false,
          lastTime: new Date().getTime(),
          boostTime: boosts[index].boostTime + deltaTime,
        },
        ...boosts.slice(index + 1),
      ];
      updateProjectedWinner(newBoosts);
      return newBoosts;
    });
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} position={{}} />
      <LanesContainer>
        {racerIds.map((racerId, index) => {
          const { isActive, lastTime, boostTime } = boosts[index];
          let effBoostTime = (boostTime - lastTime + lastCycle) / cycleTime;
          const effTime = isActive ? Animated.add(
            Animated.multiply(raceAnim, 2),
            effBoostTime
          ) : Animated.add(raceAnim, boostTime / cycleTime);
          const translateY = Animated.multiply(effTime, multipliers[index])
            .interpolate({
              inputRange: [0, 1],
              outputRange: [styles.levelTextSize, -screenHeight]
            });

          return (
            <Lane
              key={String(racerId)}
              onPressIn={() => handleLanePressIn(index)}
              onPressOut={() => handleLanePressOut(index)}
            >
              <Racer style={{transform: [{ translateY }]}}>
                <LevelText>{racerId}</LevelText>
              </Racer>
            </Lane>
          );
        })}
        </LanesContainer>
      {/* <LevelText hidden={twelve}>twelve</LevelText> */}
      {/* {coinPositions.map((coinPosition, index: number) => (
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

export default LevelRace;
