import React from 'react';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelCounter from 'components/LevelCounter';
import useSettings from 'hooks/useSettings';
import { MusicIcon, SfxIcon, ColorblindIcon } from 'components/SettingsModal/components';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

type Category = 'music' | 'sfx' | 'colorblind';
const categories = ['music', 'sfx', 'colorblind'] as Array<Category>;

const panelWidth = levelWidth / 2;
const panelHeight = levelHeight / 4;

const PanelContainer = styled.View`
  width: ${panelWidth}px;
  height: ${panelHeight}px;
  justify-content: flex-start;
  align-items: center;
`;

const PanelsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const IconsContainer = styled.View`
  flex-direction: row;
  padding: ${styles.coinSize / 2}px;
`;

const CoinsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;
`;

const LevelSettingsToggle: Level = (props) => {

  const { music, sfx, colorblind } = useSettings(categories)[0];

  const combinations = [
    {
      icons: [MusicIcon],
      conditions: [music],
    },
    {
      icons: [SfxIcon, ColorblindIcon],
      conditions: [sfx, colorblind],
    },
    {
      icons: [SfxIcon],
      conditions: [sfx],
    },
    {
      icons: [MusicIcon, ColorblindIcon],
      conditions: [music, colorblind],
    },
    {
      icons: [ColorblindIcon],
      conditions: [colorblind],
    },
    {
      icons: [MusicIcon, SfxIcon],
      conditions: [music, sfx],
    },
  ];

  const reset = () => props.setCoinsFound(new Set());

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <PanelsContainer>
        {combinations.map(({ icons, conditions }, index) => {
          const enabled1 = conditions.every(condition => condition);
          const enabled2 = conditions.every(condition => !condition);
          return (
            <PanelContainer key={String(index)}>
              <IconsContainer>
                {icons.map((Icon, index) => (
                  <Icon color={colors.foreground} key={String(index)} />
                ))}
              </IconsContainer>
              <CoinsContainer>
                <Coin
                  color={colors[enabled1 ? 'coin' : 'badCoin']}
                  disabled={props.coinsFound.has(2 * index)}
                  hidden={props.coinsFound.has(2 * index)}
                  onPress={() => enabled1 ? props.onCoinPress(2 * index) : reset()}
                />
                <Coin
                  color={colors[enabled2 ? 'coin' : 'badCoin']}
                  disabled={props.coinsFound.has(2 * index + 1)}
                  hidden={props.coinsFound.has(2 * index + 1)}
                  onPress={() => enabled2 ? props.onCoinPress(2 * index + 1) : reset()}
                />
              </CoinsContainer>
            </PanelContainer>
          );
        })}
      </PanelsContainer>
    </LevelContainer>
  );
};

export default LevelSettingsToggle;
