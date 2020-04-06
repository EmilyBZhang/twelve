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

interface CMYSlidersProps {
  setColors: SetColors;
}

const CMYSliders: FunctionComponent<CMYSlidersProps> = (props) => {
  const [setCyan, setMagenta, setYellow] = props.setColors;

  return (<>
    <ColorSlider
      thumbTintColor={'cyan'}
      onValueChange={setCyan}
    />
    <ColorSlider
      thumbTintColor={'magenta'}
      onValueChange={setMagenta}
    />
    <ColorSlider
      thumbTintColor={'yellow'}
      onValueChange={setYellow}
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
  color: 'white'
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

const LevelCMYSliders: Level = (props) => {
  const [cyanBg, setCyanBg] = useState<number>(0);
  const [magentaBg, setMagentaBg] = useState<number>(0);
  const [yellowBg, setYellowBg] = useState<number>(0);

  const [cyanCoin, setCyanCoin] = useState<number>(0);
  const [magentaCoin, setMagentaCoin] = useState<number>(0);
  const [yellowCoin, setYellowCoin] = useState<number>(0);

  const goodTotal = cyanBg + cyanCoin + magentaCoin;
  const badTotal = magentaBg + yellowBg + yellowCoin;
  const canPress = (goodTotal === 255 * 3) && (badTotal === 0);

  const bgColor = `rgb(${255 - cyanBg}, ${255 - magentaBg}, ${255 - yellowBg})`;
  const coinColor = `rgb(${255 - cyanCoin}, ${255 - magentaCoin}, ${255 - yellowCoin})`;
  const lockOpacity = 1 - goodTotal / (255 * 3 + badTotal);

  const numCoinsFound = props.coinsFound.size;

  return (
    <LevelContainer color={bgColor}>
      <LevelCounter count={numCoinsFound} />
      <CMYSliders setColors={[setCyanBg, setMagentaBg, setYellowBg] as SetColors} />
      <CMYSliders setColors={[setCyanCoin, setMagentaCoin, setYellowCoin] as SetColors} />
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

export default LevelCMYSliders;
