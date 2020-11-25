import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import useSettings from 'hooks/useSettings';
import MuteMusicIcon from 'components/icons/MuteMusicIcon';
import MuteSfxIcon from 'components/icons/MuteSfxIcon';
import ColorblindIcon from 'components/icons/ColorblindIcon';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

type Category = 'musicMuted' | 'sfxMuted' | 'colorblind';
const categories = ['musicMuted', 'sfxMuted', 'colorblind'] as Array<Category>;

const smallPanelSize = levelWidth / 2;
const largePanelSize = levelWidth - smallPanelSize;
const panelHeight = levelHeight / 4;

interface PanelContainerProps {
  large?: boolean;
}

const PanelContainer = styled.View<PanelContainerProps>`
  width: ${props => props.large ? largePanelSize : smallPanelSize}px;
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

type iconName = 'music' | 'sfx' | 'colorblind';

interface PanelProps {
  iconName1: iconName;
  iconName2?: iconName;
  condition1: boolean;
  condition2?: boolean;
}

const icons = {
  'music': MuteMusicIcon,
  'sfx': MuteSfxIcon,
  'colorblind': ColorblindIcon,
};

const Panel: FunctionComponent<PanelProps> = (props) => {
  const { iconName1, iconName2, condition1, condition2 } = props;
  const Icon1 = icons[iconName1];
  const Icon2 = (iconName2 !== undefined) ? icons[iconName2] : Icon1;
  const c2 = (condition2 === undefined) ? condition1 : condition2;
  const disabled1 = condition1 || c2;
  const disabled2 = !condition1 || !c2;
  return (
    <PanelContainer large={iconName2 !== undefined}>
      <IconsContainer>
        <Icon1 color={colors.foreground} />
        {(iconName2 !== undefined) && <Icon2 color={colors.foreground} />}
      </IconsContainer>
      <CoinsContainer>
        <Coin color={disabled1 ? colors.badCoin : colors.coin} />
        <Coin color={disabled2 ? colors.badCoin : colors.coin} />
      </CoinsContainer>
    </PanelContainer>
  );
};

enum Setting {
  MUSIC_MUTED = 1,
  SFX_MUTED = 2,
  COLORBLIND = 4,
}

const LevelSettingsToggle: Level = (props) => {

  const { musicMuted, sfxMuted, colorblind } = useSettings(categories)[0];

  const combinations = [
    Setting.MUSIC_MUTED,
    Setting.SFX_MUTED | Setting.COLORBLIND,
    Setting.SFX_MUTED,
    Setting.MUSIC_MUTED | Setting.COLORBLIND,
    Setting.COLORBLIND,
    Setting.MUSIC_MUTED | Setting.SFX_MUTED,
  ];

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <PanelsContainer>
        {/* {combinations.map((comb, index) => (
          <PanelContainer>
            <IconsContainer>
              {!!(comb & Setting.MUSIC_MUTED) && <MuteMusicIcon color={colors.foreground} />}
              {!!(comb & Setting.SFX_MUTED) && <MuteSfxIcon color={colors.foreground} />}
              {!!(comb & Setting.COLORBLIND) && <ColorblindIcon color={colors.foreground} />}
            </IconsContainer>
            <CoinsContainer>
              <Coin />
              <Coin />
            </CoinsContainer>
          </PanelContainer>
        ))} */}
        <Panel
          iconName1={'music'}
          condition1={musicMuted}
        />
        <Panel
          iconName1={'sfx'}
          iconName2={'colorblind'}
          condition1={sfxMuted}
          condition2={colorblind}
        />
        <Panel
          iconName1={'sfx'}
          condition1={sfxMuted}
        />
        <Panel
          iconName1={'music'}
          iconName2={'colorblind'}
          condition1={musicMuted}
          condition2={colorblind}
        />
        <Panel
          iconName1={'colorblind'}
          condition1={musicMuted}
        />
        <Panel
          iconName1={'music'}
          iconName2={'sfx'}
          condition1={musicMuted}
          condition2={sfxMuted}
        />
      </PanelsContainer>
    </LevelContainer>
  );
};

export default LevelSettingsToggle;
