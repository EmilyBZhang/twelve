import React, { useState } from 'react';
import { Button, View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import useCongratsMessage from 'hooks/useCongratsMessage';
import colors from 'assets/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

// TODO: Change absolute dimensions to be relative to screen size
const ColorSlider = styled.Slider.attrs({
  minimumValue: 0,
  maximumValue: 255,
  minimumTrackTintColor: colors.coin,
  maximumTrackTintColor: colors.background
})`
  width: 100px;
  height: 10px;
  z-index: 1;
  position: absolute;
  top: 80px;
  right: -20px;
  transform: scaleX(2) scaleY(2) rotate(90deg);
`;

const LevelSlider: Level = (props) => {
  const [sliderVal, setSliderVal] = useState<number>(0);
  const congratsMessage = useCongratsMessage();

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
      <LevelText color={'white'}>
        {twelve ? congratsMessage : hintText}
      </LevelText>
      {twelve && (
        <Button
          title={'Next level!'}
          onPress={() => props.onNextLevel()}
        />
      )}
      {coinPositions.map((coinPosition, index: number) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            hidden={sliderVal === 0}
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelSlider;
