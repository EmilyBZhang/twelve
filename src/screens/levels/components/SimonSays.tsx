import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import { Button, FlatList } from 'react-native';
import styled from 'styled-components/native';

import { LevelProps } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import useCongratsMessage from 'hooks/useCongratsMessage';
import colors, { CoinColor } from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const coinSize = styles.coinSize * 2;

interface SimonSaysProps extends LevelProps {
  simonDoesNotSay?: boolean;
}

interface ColorScreenProps {
  color: CoinColor | null;
  border: boolean;
}

const ColorScreen = styled.View<ColorScreenProps>`
  width: ${levelWidth / 2}px;
  height: ${levelWidth / Math.sqrt(2)}px;
  background-color: ${props => props.color || 'transparent'};
  ${props => props.border && 'border: 4px solid black;'}
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
    coinColors[Math.floor(Math.random() * coinColors.length)]
  ));
};

const generateNegateOrder = (simonDoesNotSay: boolean) => {
  return Array.from(Array(12), () => (
    simonDoesNotSay && !!(Math.round(Math.random()))
  ))
};

const numIterations = [2, 4, 6];
const startingIndices = [0, 2, 6];

const SimonSays: FunctionComponent<SimonSaysProps> = (props) => {
  const { simonDoesNotSay } = props;
  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const congratsMessage = useCongratsMessage();
  const [blinkingColors, setBlinkingColors] = useState(true);
  const [iterationsIndex, setIterationsIndex] = useState(0);
  const [colorOrder, setColorOrder] = useState(generateColorOrder());
  const [negateOrder, setNegateOrder] = useState(
    generateNegateOrder(!!simonDoesNotSay)
  );
  const [colorIndex, setColorIndex] = useState(-1);
  
  const iterations = numIterations[iterationsIndex];

  const resetColors = () => {
    setIterationsIndex(0);
    setColorOrder(generateColorOrder());
    setNegateOrder(generateNegateOrder(!!simonDoesNotSay));
    setColorIndex(-1);
    setBlinkingColors(true);
  };

  const intervalRef = useRef<any>(null);
  const intervalIndex = useRef<number>(0);
  useEffect(() => {
    if (blinkingColors) {
      intervalRef.current = setInterval(() => {
        const i = intervalIndex.current;
        if (i == iterations * 2) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          intervalIndex.current = 0;
          setColorIndex(-1);
          setBlinkingColors(false);
          return;
        }
        const start = startingIndices[iterationsIndex];
        setColorIndex((i % 2 == 0) ? -1 : start + Math.floor(i / 2));
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
      {twelve ? (<>
        <LevelText>
          {congratsMessage}
        </LevelText>
        <Button
          title={'Next level!'}
          onPress={() => props.onNextLevel()}
        />
      </>) : (<>
        <ColorScreen
          color={colorIndex < 0 ? null : colorOrder[colorIndex]}
          border={colorIndex >= 0 && negateOrder[colorIndex]}
        />
        <CoinListContainer>
          <FlatList
            data={coinColors}
            extraData={[blinkingColors, numCoinsFound]}
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
        {/* {coinColors.map((coinColor, index: number) => (
          <Coin
            key={String(index)}
            hidden={blinkingColors}
            disabled={blinkingColors}
            size={coinSize}
            color={coinColor}
            onPress={() => handleCoinPress(index)}
          />
        ))} */}
      </>)}
    </LevelContainer>
  );
};

export default SimonSays;
