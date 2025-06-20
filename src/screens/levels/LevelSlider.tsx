import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import coinPositions from 'utils/coinPositions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ScavengerText from 'components/ScavengerText';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const { coinSize } = styles;

const sliderWidth = coinSize / 2;
const sliderHeight = levelHeight / 6;

// TODO: See if maximumValue needs to be greater than 1 for iOS
const ColorSlider = styled.Slider.attrs({
  minimumValue: 0,
  maximumValue: 1,
  minimumTrackTintColor: colors.coin,
  maximumTrackTintColor: colors.background,
})`
  width: ${sliderHeight}px;
  height: ${sliderWidth}px;
  z-index: 1;
  position: absolute;
  transform:
    rotate(90deg)
    translateY(${sliderHeight / 2 - levelHeight / 4}px)
    translateX(${levelWidth / 4 - sliderWidth * 3/4}px)
    scale(2, 2)
    ;
`;

interface CoverProps {
  opacity: number;
}

const Cover = styled.View.attrs({
  pointerEvents: 'none'
})<CoverProps>`
  background-color: ${colors.coin};
  opacity: ${props => props.opacity};
  position: absolute;
  top: -${styles.levelNavHeight}px;
  padding-top: ${styles.levelNavHeight}px;
  width: ${levelWidth}px;
  height: ${levelHeight + styles.levelNavHeight}px;
  justify-content: center;
  align-items: center;
`;

const LevelSlider: Level = (props) => {
  const [sliderVal, setSliderVal] = useState<number>(0);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <ColorSlider
        value={0}
        onValueChange={setSliderVal}
      />
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>There they are!</LevelText>
      {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
      <Cover opacity={1 - sliderVal}>
        <LevelText color={colors.darkText} hidden={twelve}>
          Where'd they <ScavengerText>g</ScavengerText>o?
        </LevelText>
      </Cover>
    </LevelContainer>
  );
};

export default LevelSlider;
