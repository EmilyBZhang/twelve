import React, { FunctionComponent, useState, useEffect, useRef, useMemo } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';

import { LevelProps } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import { randElem, shuffleArray } from 'utils/random';
import colors, { CoinColor } from 'res/colors';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import ColorHint from 'components/ColorHint';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const coinSize = styles.coinSize * 2;

interface SimonSaysProps extends LevelProps {
  simonDoesNotSay?: boolean;
}

const colorScreenSize = levelWidth / 2;
const colorScreenBorderWidth = coinSize / 12;

interface ColorScreenProps {
  color: CoinColor | null;
  border: boolean;
}

const ColorScreen = styled.View<ColorScreenProps>`
  width: ${colorScreenSize}px;
  height: ${colorScreenSize}px;
  background-color: ${props => props.color || 'transparent'};
  justify-content: center;
  align-items: center;
  ${props => props.border && `border: ${colorScreenBorderWidth}px solid black;`}
`;

const coinMargin = styles.coinSize / 4;

const CoinContainer = styled.View`
  margin: ${coinMargin}px;
`;

const coinListSize = 2 * (coinSize + coinMargin * 2);

const CoinListContainer = styled.View`
  width: ${coinListSize}px;
  height: ${coinListSize}px;
`;

const coinColors = [
  colors.badCoin,
  colors.orderedCoin,
  colors.selectCoin,
  colors.coin,
];

const generateColorOrder = () => {
  return Array.from(Array(12), () => (
    randElem(coinColors)
  ));
};

const generateNegateOrder = (simonDoesNotSay: boolean) => {
  if (!simonDoesNotSay) return Array.from(Array(12), () => false);
  const order = [true, true, true, true, true, true, false, false, false, false, false, false];
  shuffleArray(order);
  return order;
};

// TODO: Consider changing this to [3, 4, 5] and [0, 3, 7]
const numIterations = [2, 4, 5, 1];
const startingIndices = [0, 2, 6, 11];

const SimonSays: FunctionComponent<SimonSaysProps> = (props) => {
  const { simonDoesNotSay } = props;
  
  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  const [blinkingColors, setBlinkingColors] = useState(true);
  const [iterationsIndex, setIterationsIndex] = useState(0);
  const colorOrder = useMemo(generateColorOrder, []);
  const negateOrder = useMemo(() => generateNegateOrder(!!simonDoesNotSay), [!!simonDoesNotSay]);
  const [colorIndex, setColorIndex] = useState(-1);
  
  const iterations = numIterations[iterationsIndex];

  const resetColors = () => {
    setIterationsIndex(0);
    setColorIndex(-1);
    setBlinkingColors(true);
  };

  const intervalRef = useRef<any>(null);
  const intervalIndex = useRef<number>(0);
  useEffect(() => {
    if (blinkingColors) {
      intervalRef.current = setInterval(() => {
        const i = intervalIndex.current;
        if (i === iterations * 2) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          intervalIndex.current = 0;
          setColorIndex(-1);
          setBlinkingColors(false);
          return;
        }
        const start = startingIndices[iterationsIndex];
        setColorIndex((i % 2 === 0) ? -1 : start + Math.floor(i / 2));
        intervalIndex.current++;
      }, 500);
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [blinkingColors]);

  const handleCoinPress = (index: number) => {
    const match = coinColors[index] === colorOrder[numCoinsFound];
    const simon = !negateOrder[numCoinsFound];
    if (match === simon) {
      if (numCoinsFound + 1 === iterations + startingIndices[iterationsIndex]) {
        setBlinkingColors(true);
        setIterationsIndex(state => state + 1);
      }
      props.onCoinPress(numCoinsFound);
    } else {
      props.setCoinsFound(new Set<number>());
      resetColors();
    }
  };

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <ColorScreen
        color={colorIndex < 0 ? null : colorOrder[colorIndex]}
        border={colorIndex >= 0 && negateOrder[colorIndex]}
      >
        <ColorHint
          color={colorOrder[colorIndex]}
          size={colorScreenSize - colorScreenBorderWidth * 2}
          opacity={(colorIndex === -1 || twelve) ? 0 : 1}
        />
      </ColorScreen>
      <CoinListContainer>
        <FlatList
          data={coinColors}
          extraData={[blinkingColors, numCoinsFound]}
          scrollEnabled={false}
          numColumns={2}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item: coinColor, index }) => (
            <CoinContainer>
              <Coin
                hidden={blinkingColors}
                disabled={blinkingColors}
                size={coinSize}
                color={coinColor}
                onPress={() => handleCoinPress(index)}
              />
            </CoinContainer>
          )}
        />
      </CoinListContainer>
    </LevelContainer>
  );
};

export default SimonSays;
