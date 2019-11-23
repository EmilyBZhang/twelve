import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import coinPositions from 'utils/coinPositions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const { coinSize } = styles;

const sliderWidth = coinSize / 2;
const sliderHeight = levelHeight / 6;

const ColorSlider = styled.Slider.attrs({
  minimumValue: 0,
  maximumValue: 255,
  minimumTrackTintColor: colors.coin,
  maximumTrackTintColor: colors.background,
})`
  width: ${sliderHeight}px;
  height: ${sliderWidth}px;
  z-index: 1;
  position: absolute;
  transform:
    scaleX(2)
    scaleY(2)
    rotate(90deg)
    translateX(${(levelWidth - sliderWidth - coinSize) / 2}px)
    translateY(-${(levelHeight - sliderHeight) / 2 - coinSize}px);
`;

const LevelSlider: Level = (props) => {
  const [sliderVal, setSliderVal] = useState<number>(0);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  const hintText = sliderVal === 255 ? 'There they are!' : `Where'd they go?`;

  return (
    <LevelContainer color={`rgb(0, ${sliderVal}, 255)`}>
      <ColorSlider
        onValueChange={setSliderVal}
      />
      <LevelCounter
        count={numCoinsFound}
        color={'white'}
      />
      <LevelText color={'white'} hidden={twelve}>{hintText}</LevelText>
      {coinPositions.map((coinPosition, index: number) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            hidden={sliderVal === 0}
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
            colorHintOpacity={sliderVal / 255}
          />
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelSlider;
