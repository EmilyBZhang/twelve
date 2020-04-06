// TODO: Consider merging this file with LevelCMYSliders similar to SimonSays

import React, { useState, FunctionComponent } from 'react';
import { View } from 'react-native';
import { Foundation } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import ColorHint from 'components/ColorHint';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const { coinSize } = styles;

const ColorSlider = styled.Slider.attrs(props => ({
  minimumValue: 0,
  maximumValue: 255,
  minimumTrackTintColor: props.thumbTintColor,
  maximumTrackTintColor: 'black'
}))`
  width: ${levelWidth / 2 - coinSize}px;
  height: ${coinSize / 2}px;
  margin-top: ${coinSize / 4}px;
  margin-bottom: ${coinSize / 4}px;
  transform: scaleX(2) scaleY(2);
`;

type SetColor = (val: number) => any;
type SetColors = [SetColor, SetColor, SetColor];

interface RGBSlidersProps {
  setColors: SetColors;
}

const RGBSliders: FunctionComponent<RGBSlidersProps> = (props) => {
  const [setRed, setGreen, setBlue] = props.setColors;

  return (<>
    <ColorSlider
      thumbTintColor={'red'}
      onValueChange={setRed}
    />
    <ColorSlider
      thumbTintColor={'lime'}
      onValueChange={setGreen}
    />
    <ColorSlider
      thumbTintColor={'blue'}
      onValueChange={setBlue}
    />
  </>)
};

interface ColorProps {
  color: string;
}

const Color = styled.View<ColorProps>`
  width: ${coinSize}px;
  height: ${coinSize}px;
  border-radius: ${coinSize / 2}px;
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
  /* ${props => props.color === 'rgb(0, 0, 255)' && `display: none;`} */
`;

interface LockIconProps {
  opacity: number;
}

const LockIcon = styled(Foundation).attrs({
  name: 'lock',
  size: coinSize / 2,
  color: 'black'
})<LockIconProps>`
  opacity: ${props => props.opacity};
`;

const initY = levelHeight / 2 - coinSize * 3;
const deltaY = coinSize;

const coinPositions = Array.from(Array(12), (_, index) => (
  (index < 6) ? ({
    top: initY + index * deltaY,
    left: coinSize / 2,
  }) : ({
    top: initY + (index % 6) * deltaY,
    right: coinSize / 2,
  })
));

const LevelRGBSliders: Level = (props) => {
  const [redBg, setRedBg] = useState<number>(0);
  const [greenBg, setGreenBg] = useState<number>(0);
  const [blueBg, setBlueBg] = useState<number>(0);

  const [redCoin, setRedCoin] = useState<number>(0);
  const [greenCoin, setGreenCoin] = useState<number>(0);
  const [blueCoin, setBlueCoin] = useState<number>(0);

  const goodTotal = greenBg + blueBg + blueCoin;
  const badTotal = redBg + redCoin + greenCoin;
  const canPress = (goodTotal >= 255 * 3 - 36) && (badTotal <= 36);

  const bgColor = `rgb(${redBg}, ${greenBg}, ${blueBg})`;
  const coinColor = `rgb(${redCoin}, ${greenCoin}, ${blueCoin})`;
  const lockOpacity = 1 - goodTotal / (255 * 3 + badTotal);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  // const hintText = colorVal === 255 ? 'There they are!' : `Where'd they go?`;

  return (
    <LevelContainer color={bgColor}>
      <LevelCounter count={numCoinsFound} />
      <RGBSliders setColors={[setRedBg, setGreenBg, setBlueBg] as SetColors} />
      {/* <LevelText color={'white'} hidden={twelve}>{hintText}</LevelText> */}
      <RGBSliders setColors={[setRedCoin, setGreenCoin, setBlueCoin] as SetColors} />
      {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{
            position: 'absolute',
            ...coinPosition
          }}
        >
          <Coin
            disabled={!canPress}
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
            // colorHintOpacity={colorHintOpacity}
          >
            {!canPress && (
              <Color color={coinColor}>
                <LockIcon opacity={lockOpacity} />
                {/* <ColorHint
                  color={colors.coin}
                  opacity={colorHintOpacity}
                /> */}
              </Color>
            )}
          </Coin>
        </View>
      ))}
    </LevelContainer>
  );
};

export default LevelRGBSliders;
