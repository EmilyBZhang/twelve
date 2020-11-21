import React, { useMemo, useRef, useState } from 'react';
import { Animated, Easing, FlatList } from 'react-native';
import styled from 'styled-components/native';

import WirePart, { wirePartSize, WireType } from './components/WirePart';
import { Level } from 'utils/interfaces';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import { arraysEqual } from 'utils/arrays';

const WiresContainer = styled.View`
  width: ${wirePartSize * 3}px;
  height: ${wirePartSize * 3}px;
`;

const WirePartContainer = styled.View`
  width: ${wirePartSize}px;
  height: ${wirePartSize}px;
  justify-content: center;
  align-items: center;
`;

const CoinContainer = styled(Animated.View)`
  position: absolute;
  justify-content: center;
  align-items: center;
`;

const wireTypes = [
  WireType.segment,
  WireType.segment,
  WireType.corner,
  WireType.line,
  WireType.corner,
  WireType.corner,
  WireType.segment,
  WireType.corner,
  WireType.segment,
];
const initWireOrientations = wireTypes.map(() => 0);
const targetWireOrientations = [
  2, 1, 3,
  0, 2, 0,
  0, 1, 3,
];

const Level12Wire: Level = (props) => {
  const [
    wireOrientations,
    setWireOrientations
  ] = useState(() => initWireOrientations.slice());
  const [coinAnim] = useState(new Animated.Value(0));
  
  const coinsRevealed = useRef(false);
  // TODO: Use sets instead of arraysEqual because of complexity
  // Though might not be much of an issue because n is always 9
  if (!coinsRevealed.current && arraysEqual(wireOrientations, targetWireOrientations)) {
    coinsRevealed.current = true;
    Animated.timing(coinAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }

  const numCoinsFound = props.coinsFound.size;

  const handleOrientationChange = useMemo(() => {
    return wireOrientations.map((_, index) => () => setWireOrientations(state => {
      const mod = (wireTypes[index] === WireType.line) ? 2 : 4;
      const newOrientation = (state[index] + 1) % mod;

      return [
        ...state.slice(0, index),
        newOrientation,
        ...state.slice(index + 1),
      ];
    }));
  }, []);

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <WiresContainer>
        <FlatList
          data={initWireOrientations}
          extraData={[coinsRevealed.current, numCoinsFound]}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item: initOrientation, index }) => {
            return (
              <WirePartContainer>
                <WirePart
                  disabled={coinsRevealed.current}
                  type={wireTypes[index]}
                  initOrientation={initOrientation}
                  onOrientationChange={handleOrientationChange[index]}
                />
                {coinsRevealed.current && (
                  <CoinContainer style={{opacity: coinAnim}}>
                    <Coin
                      found={props.coinsFound.has(index)}
                      onPress={() => props.onCoinPress(index)}
                      size={styles.coinSize * ((index % 3 === 0) ? 0.75 : 1)}
                    />
                    {(index % 3 === 0) && (
                      <CoinContainer>
                        <Coin
                          found={props.coinsFound.has(9 + index / 3)}
                          onPress={() => props.onCoinPress(9 + index / 3)}
                          size={styles.coinSize * 13 / 12}
                        />
                      </CoinContainer>
                    )}
                  </CoinContainer>
                )}
              </WirePartContainer>
            );
          }}
        />
      </WiresContainer>
    </LevelContainer>
  );
};

export default Level12Wire;
