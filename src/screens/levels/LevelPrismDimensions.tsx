import React, { FunctionComponent, memo, useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const containerWidth = Math.floor(levelWidth / 2);
const containerHeight = levelHeight / 2;
const sScale = containerHeight / 16;

const maxLength = 3;
const maxWidth = 5;
const maxHeight = 8;

const angle = Math.PI / 6;

const maxSliderHeight =
  (levelHeight - styles.levelNavHeight - containerHeight) / 3;
const sliderTextWidth = styles.coinSize * 2;
const sliderWidth = levelWidth - 2 * sliderTextWidth;

const numCoinRows = 3;
const numCoinCols = 4;

const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

const CoinsContainer = styled(Animated.View)`
  position: absolute;
  left: 0px;
  top: ${containerHeight}px;
  background-color: ${colors.background};
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: ${levelWidth};
  height: ${maxSliderHeight * 3}px;
`;

const CoinRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const PrismContainer = styled.View`
  width: ${containerWidth}px;
  height: ${containerHeight}px;
  justify-content: center;
  align-items: center;
`;

const PrismSvg = styled(Svg)`
  position: absolute;
  width: ${containerWidth}px;
  height: ${containerHeight}px;
`;

const DimSlider = styled(Slider).attrs({
  minimumValue: 0,
  step: 1,
})`
  width: ${sliderWidth}px;
  max-height: ${maxSliderHeight}px;
`;

const SliderText = styled.Text`
  font-family: montserrat;
  font-size: ${styles.coinSize}px;
  text-align: center;
  width: ${sliderTextWidth}px;
  height: ${maxSliderHeight}px;
`;

interface PrismProps {
  length: number;
  width: number;
  height: number;
}

const Prism: FunctionComponent<PrismProps> = memo((props) => {
  const { length, width, height } = props;

  const sLength = length * sScale;
  const sWidth = width * sScale;
  const sHeight = height * sScale;

  const x0 = containerWidth / 2;
  const y0 = (containerHeight * 11) / 12;
  const x1 = x0;
  const y1 = y0 - sHeight;

  const x3 = x0 - Math.cos(angle) * sLength;
  const y3 = y0 - Math.sin(angle) * sLength;
  const x2 = x3;
  const y2 = y3 - sHeight;

  const x5 = x0 + Math.sin(angle) * sWidth;
  const y5 = y0 - Math.cos(angle) * sWidth;
  const x4 = x5;
  const y4 = y5 - sHeight;

  const x6 = x2 + x4 - x1;
  const y6 = y2 + y4 - y1;

  const points0 = [
    x0,
    y0,
    x3,
    y3,
    x2,
    y2,
    x6,
    y6,
    x4,
    y4,
    x5,
    y5,
  ] as ReadonlyArray<number>;
  const points1 = [x0, y0, x1, y1, x2, y2, x3, y3] as ReadonlyArray<number>;
  const points2 = [x0, y0, x1, y1, x4, y4, x5, y5] as ReadonlyArray<number>;
  const points3 = [x1, y1, x2, y2, x6, y6, x4, y4] as ReadonlyArray<number>;

  return (
    <PrismContainer>
      <PrismSvg>
        <Polygon points={points0} fill={colors.coin} />
        <Polygon points={points1} fill={'#000000'} fillOpacity={0.5} />
        <Polygon points={points2} fill={'#000000'} fillOpacity={1 / 12} />
        <Polygon points={points3} fill={'#000000'} fillOpacity={0.25} />
      </PrismSvg>
      <LevelText color={colors.darkText}>{length * width * height}</LevelText>
    </PrismContainer>
  );
});

const LevelPrismDimensions: Level = (props) => {
  const [coinOpacity] = useState(new Animated.Value(0));

  const [length, setLength] = useState(3);
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(8);

  const volume1 = length * width * height;
  const volume2 =
    (maxLength - length) * (maxWidth - width) * (maxHeight - height);
  const isRevealed = volume1 === 12 && volume2 === 12;

  useEffect(() => {
    if (!isRevealed) return;
    Animated.timing(coinOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isRevealed]);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer style={{ justifyContent: 'flex-start' }}>
      <LevelCounter count={numCoinsFound} />
      <RowContainer>
        <Prism length={length} width={width} height={height} />
        <Prism
          length={maxLength - length}
          width={maxWidth - width}
          height={maxHeight - height}
        />
      </RowContainer>
      <RowContainer>
        <SliderText>{length}</SliderText>
        <DimSlider
          value={length}
          disabled={isRevealed}
          maximumValue={maxLength}
          onValueChange={setLength}
        />
        <SliderText>{maxLength - length}</SliderText>
      </RowContainer>
      <RowContainer>
        <SliderText>{width}</SliderText>
        <DimSlider
          value={width}
          disabled={isRevealed}
          maximumValue={maxWidth}
          onValueChange={setWidth}
        />
        <SliderText>{maxWidth - width}</SliderText>
      </RowContainer>
      <RowContainer>
        <SliderText>{height}</SliderText>
        <DimSlider
          value={height}
          disabled={isRevealed}
          maximumValue={maxHeight}
          onValueChange={setHeight}
        />
        <SliderText>{maxHeight - height}</SliderText>
      </RowContainer>
      {isRevealed && (
        <CoinsContainer style={{ opacity: coinOpacity }}>
          {Array.from(Array(numCoinRows), (_, row) => (
            <RowContainer key={String(row)}>
              {Array.from(Array(numCoinCols), (_, col) => {
                const index = row * numCoinCols + col;
                const found = props.coinsFound.has(index);
                return (
                  <Coin
                    key={String(index)}
                    hidden={found}
                    disabled={found}
                    onPress={() => props.onCoinPress(index)}
                  />
                );
              })}
            </RowContainer>
          ))}
        </CoinsContainer>
      )}
    </LevelContainer>
  );
};

export default LevelPrismDimensions;
